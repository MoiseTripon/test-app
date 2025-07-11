import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-persons-modal',
  templateUrl: './persons-modal.component.html',
})
export class PersonsModalComponent implements OnInit {
  @Input() id_person: number | undefined;

  modal = {} as any;
  cars: any[] | null = [];

  constructor(
    private _spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this._spinner.show();

    axios.get('/api/cars').then(({ data }) => {
      this.cars = data.map((c: any) => ({
        id: c.id,
        name: `${c.brand_name} ${c.model_name} (${c.production_year})`,
      }));
    });

    if (this.id_person) {
      axios
        .get(`/api/persons/${this.id_person}`)
        .then(({ data }) => {
          this.modal = data;

          this.modal.masini = data.Cars?.map((c: any) => c.id) || [];

          this._spinner.hide();
        })
        .catch(() => {
          this.toastr.error('Eroare la preluarea persoanei!');
          this._spinner.hide();
        });
    } else {
      this._spinner.hide();
    }
  }

  calculateAgeFromCNP(cnp: string): number | null {
    if (!/^[1-8]\d{12}$/.test(cnp)) return null;
    const yearPrefix = ['19', '19', '18', '18', '20', '20', '20', '20'][
      +cnp[0] - 1
    ];
    const year = parseInt(yearPrefix + cnp.slice(1, 3));
    const month = parseInt(cnp.slice(3, 5)) - 1;
    const day = parseInt(cnp.slice(5, 7));
    const birthDate = new Date(year, month, day);
    const ageDiff = new Date().getTime() - birthDate.getTime();
    return new Date(ageDiff).getUTCFullYear() - 1970;
  }

  onCnpChange(): void {
    const age = this.calculateAgeFromCNP(this.modal.cnp);
    if (age !== null) {
      this.modal.age = age;
    }
  }

  save(): void {
    const missingFields = [];
    if (!this.modal.last_name) missingFields.push('Nume');
    if (!this.modal.first_name) missingFields.push('Prenume');
    if (!this.modal.cnp) missingFields.push('CNP');

    if (missingFields.length > 0) {
      this.toastr.error('Completează: ' + missingFields.join(', '));
      return;
    }

    this._spinner.show();

    this.modal.cars = this.modal.masini;

    const request = this.id_person
      ? axios.put('/api/persons', this.modal)
      : axios.post('/api/persons', this.modal);

    request
      .then(() => {
        this._spinner.hide();
        this.toastr.success(
          `Persoana a fost ${
            this.id_person ? 'modificată' : 'salvată'
          } cu succes!`
        );
        this.activeModal.close(this.modal);
      })
      .catch(() => {
        this.toastr.error(
          `Eroare la ${this.id_person ? 'modificarea' : 'salvarea'} persoanei!`
        );
        this._spinner.hide();
      });
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere = [] as any;
    const splitTerm = term.split(' ').filter((t) => t);

    item = REPLACE_DIACRITICS(item.name);

    splitTerm.forEach((term) =>
      isWordThere.push(item.indexOf(REPLACE_DIACRITICS(term)) !== -1)
    );
    return isWordThere.every(Boolean);
  }
}
