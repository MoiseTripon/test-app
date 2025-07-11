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
import { CarsModalComponent } from './cars-modal/cars-modal.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-cars',
  templateUrl: './cars.component.html',
  styleUrls: ['./cars.component.scss'],
})
export class CarsComponent implements OnInit {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  faChevronUp = faChevronUp;
  faPlus = faPlus;
  limit: number = 70;
  showBackTop: string = '';
  cars: any = [];
  filter = {
    brand: '',
    model: '',
    year: '',
    engine: '',
    tax: '',
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

  get filteredCars(): any[] {
    return this.cars.filter((c: any) => {
      return (
        (!this.filter.brand ||
          c.brand_name
            ?.toLowerCase()
            .includes(this.filter.brand.toLowerCase())) &&
        (!this.filter.model ||
          c.model_name
            ?.toLowerCase()
            .includes(this.filter.model.toLowerCase())) &&
        (!this.filter.year ||
          String(c.production_year).includes(this.filter.year)) &&
        (!this.filter.engine ||
          String(c.engine_capacity).includes(this.filter.engine)) &&
        (!this.filter.tax || String(c.tax).includes(this.filter.tax))
      );
    });
  }

  loadData = (): void => {
    this._spinner.show();
    axios
      .get('/api/cars')
      .then(({ data }) => {
        this.cars = data;
        this._spinner.hide();
      })
      .catch(() => this.toastr.error('Eroare la preluarea mașinilor!'));
  };

  addEdit = (id_car?: number): void => {
    const modalRef = this._modal.open(CarsModalComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.id_car = id_car;
    modalRef.closed.subscribe(() => {
      this.loadData();
    });
  };

  delete = (car: any): void => {
    const modalRef = this._modal.open(ConfirmDialogComponent, {
      size: 'lg',
      keyboard: false,
      backdrop: 'static',
    });
    modalRef.componentInstance.title = `Ștergere mașină`;
    modalRef.componentInstance.content = `<p class='text-center mt-1 mb-1'>Doriți să ștergeți mașina <b>${car.brand_name} ${car.model_name}</b>?`;
    modalRef.closed.subscribe(() => {
      axios
        .delete(`/api/cars/${car.id}`)
        .then(() => {
          this.toastr.success('Mașina a fost ștearsă cu succes!');
          this.loadData();
        })
        .catch(() => this.toastr.error('Eroare la ștergerea mașinii!'));
    });
  };

  onResize(): void {
    SET_HEIGHT('view', 20, 'height');
  }

  showTopButton(): void {
    if (
      document.getElementsByClassName('view-scroll-cars')[0].scrollTop > 500
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
    SCROLL_TOP('view-scroll-cars', 0);
    this.limit = 70;
  }
}
