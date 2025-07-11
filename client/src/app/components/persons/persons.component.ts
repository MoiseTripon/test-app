import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {
  faPlus,
  faEdit,
  faTrashAlt,
  faChevronUp,
} from '@fortawesome/free-solid-svg-icons';
import { SCROLL_TOP, SET_HEIGHT } from 'src/app/utils/utils-table';
import { PersonsModalComponent } from './persons-modal/persons-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-persons',
  templateUrl: './persons.component.html',
  styleUrls: ['./persons.component.scss'],
})
export class PersonsComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  limit: number = 70;
  showBackTop: string = '';
  persons: any = [];
  filter = {
    name: '',
    cnp: '',
    age: '',
  };

  constructor(
    private _modal: NgbModal,
    private _spinner: NgxSpinnerService,
    private toastr: ToastrService
  ) {
    SET_HEIGHT('view', 20, 'height');
  }

  ngOnInit(): void {
    this.loadData();
  }

  get filteredPersons(): any[] {
    return this.persons.filter((p: any) => {
      const fullName = (p.first_name + ' ' + p.last_name).toLowerCase();
      return (
        (!this.filter.name ||
          fullName.includes(this.filter.name.toLowerCase())) &&
        (!this.filter.cnp ||
          p.cnp?.toLowerCase().includes(this.filter.cnp.toLowerCase())) &&
        (!this.filter.age || String(p.age).includes(this.filter.age))
      );
    });
  }

  loadData = (): void => {
    this._spinner.show();
    axios
      .get('/api/persons')
      .then(({ data }) => {
        this.persons = data;
        this._spinner.hide();
      })
      .catch(() => this.toastr.error('Eroare la preluarea persoanelor!'));
  };

  addEdit = (id_person?: number): void => {
    const modalRef = this._modal.open(PersonsModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.id_person = id_person;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  };

  delete = (person: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.title = `Ștergere persoana`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți persoana având numele <b>${
      person.first_name + ' ' + person.last_name
    }</b>, CNP: <b>${person.cnp}</b>?`;
    modalRef.closed.subscribe(() => {
      axios
        .delete(`/api/persons/${person.id}`)
        .then(() => {
          this.toastr.success('Persoana a fost ștearsă cu succes!');
          this.loadData();
        })
        .catch(() => this.toastr.error('Eroare la ștergerea persoanei!'));
    });
  };

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (
      document.getElementsByClassName('view-scroll-persons')[0].scrollTop > 500
    ) {
      this.showBackTop = 'show';
    } else {
      this.showBackTop = '';
    }
  }

  onScrollDown(): void {
    this.limit += 20;
  }

  onScrollTop(): void {
    SCROLL_TOP('view-scroll-persons', 0);
    this.limit = 70;
  }
}
