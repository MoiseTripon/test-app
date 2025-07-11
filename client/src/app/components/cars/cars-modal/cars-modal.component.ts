import axios from 'axios';
import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { REPLACE_DIACRITICS } from 'src/app/utils/utils-input';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cars-modal',
  templateUrl: './cars-modal.component.html',
})
export class CarsModalComponent implements OnInit {
  @Input() id_car: number | undefined;

  modal = {
    brand_name: '',
    model_name: '',
    production_year: null,
    engine_capacity: null,
    tax: 0,
  };

  constructor(
    private _spinner: NgxSpinnerService,
    public activeModal: NgbActiveModal,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    if (this.id_car) {
      this._spinner.show();
      axios
        .get(`/api/cars/${this.id_car}`)
        .then(({ data }) => {
          this.modal = data;
          this._spinner.hide();
        })
        .catch(() => {
          this.toastr.error('Eroare la preluarea mașinii!');
          this._spinner.hide();
        });
    }
  }

  updateTax(): void {
    const cc = this.modal.engine_capacity;
    if (cc == null) {
      this.modal.tax = 0;
      return;
    }

    if (cc < 1500) this.modal.tax = 50;
    else if (cc >= 1500 && cc < 2000) this.modal.tax = 100;
    else this.modal.tax = 200;
  }

  save(): void {
    const missingFields = [];
    if (!this.modal.brand_name) missingFields.push('Marcă');
    if (!this.modal.model_name) missingFields.push('Model');
    if (!this.modal.production_year) missingFields.push('An fabricație');
    if (!this.modal.engine_capacity) missingFields.push('Capacitate motor');

    if (missingFields.length > 0) {
      this.toastr.error('Completează: ' + missingFields.join(', '));
      return;
    }

    this._spinner.show();

    const request = this.id_car
      ? axios.put('/api/cars', this.modal)
      : axios.post('/api/cars', this.modal);

    request
      .then(() => {
        this._spinner.hide();
        this.toastr.success(
          `Mașina a fost ${this.id_car ? 'modificată' : 'salvată'} cu succes!`
        );
        this.activeModal.close(true);
      })
      .catch(() => {
        this.toastr.error(
          `Eroare la ${this.id_car ? 'modificarea' : 'salvarea'} mașinii!`
        );
        this._spinner.hide();
      });
  }

  selectSearch(term: string, item: any): boolean {
    const isWordThere: boolean[] = [];
    const splitTerm = term.split(' ').filter((t) => t);

    const normalizedItem = REPLACE_DIACRITICS(item.name || '');

    splitTerm.forEach((term) =>
      isWordThere.push(normalizedItem.indexOf(REPLACE_DIACRITICS(term)) !== -1)
    );

    return isWordThere.every(Boolean);
  }
}
