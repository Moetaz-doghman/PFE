import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Bordereaux } from 'src/app/Models/Bordereaux';
import { BordereauService } from 'src/app/Services/bordereau.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import * as qrcode from 'qrcode';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';


@Component({
  selector: 'app-bordereau-factures',
  templateUrl: './bordereau-factures.component.html',
  styleUrls: ['./bordereau-factures.component.css']
})
export class BordereauFacturesComponent  implements OnInit {
  
  bordereaux: Bordereaux[] = [];
  dataSource = new MatTableDataSource<Bordereaux>([]);
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  startDate: string = '';
  endDate: string = '';
  filteredBordereaux: Bordereaux[] = [];
  filterApplied: boolean = false;
  today: Date = new Date();
  @ViewChild('qrCanvas') qrCanvas: ElementRef;
  downloadingPDF: boolean = false;
  bordereauSelectionne: Bordereaux;
  donneesAdherent: any[];
  qrCodeURL: string;
  showSecondContainer: boolean = false;
  currentPage = 0;

  constructor(
    private storageService: StorageServiceService,
    private snackBar: MatSnackBar,
    private bordereauService: BordereauService
  ) {}

  ngOnInit(): void {
    this.getBordereaux();
  }

  getBordereaux() {
    this.bordereauService
      .getBordereauxByUserId(this.storageService.getUser().id)
      .subscribe(
        (bordereaux: Bordereaux[]) => {
          this.bordereaux = bordereaux;
          console.log(this.bordereaux);
          this.dataSource.data = this.bordereaux;
          this.dataSource.data = this.bordereaux.slice(0, 5);
          this.totalItems = this.bordereaux.length;
        },
        (error) => {
          console.error(
            'Erreur lors de la récupération des bordereaux :',
            error
          );
        }
      );
  }

  onPageChange(event: PageEvent) {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.bordereaux.slice(startIndex, endIndex);
    this.currentPage = event.pageIndex;
  }

  filterByDate() {
    if (!this.startDate) {
      this.openSnackBar('Veuillez sélectionner une date de début.');
      return;
    }

    let endDate: Date;
    if (!this.endDate) {
      endDate = new Date();
    } else {
      endDate = new Date(this.endDate);
    }

    const startDate = new Date(this.startDate);

    if (startDate > endDate) {
      this.openSnackBar(
        'La date de début doit être antérieure à la date de fin.'
      );
      return;
    }

    this.filteredBordereaux = this.bordereaux.filter((bordereaux) => {
      const bordereauxDate = new Date(bordereaux.dateCreationF);
      return bordereauxDate >= startDate && bordereauxDate <= endDate;
    });

    this.filterApplied = true;
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 3000,
    });
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }

  getPrestationData(bordereau: Bordereaux): any[][] {
    const prestations = bordereau.prestations;
    const data: any[][] = [];

    prestations.forEach((prestation) => {
      data.push([
        prestation.adherant.nom + prestation.adherant.prenom,
        prestation.adherant.matricule,
        prestation.user.nom + prestation.user.prenom,
        prestation.user.email,
        prestation.ref,
        this.formatDate(prestation.dateCreation),
      ]);
    });

    console.log(data);
    return data;
  }

  toggleSecondContainer() {
    this.showSecondContainer = !this.showSecondContainer;
  }

  downloadPDF(bordereau: Bordereaux) {
    this.showSecondContainer = !this.showSecondContainer;
    this.bordereauSelectionne = bordereau;
    this.donneesAdherent = this.getPrestationData(bordereau);

    this.downloadingPDF = true;
    const qrData = `Référence: ${bordereau.refNumber}, Numéro de facture: ${bordereau.numFacture}`;
    qrcode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Erreur lors de la génération du QR code :', err);
        return;
      }
      this.qrCodeURL = url;
    });

    if (this.bordereauSelectionne && this.donneesAdherent) {
      this.waitForDataToBeReady().then(() => {
        const element = document.getElementById('pdfSection');
        html2canvas(element).then((canvas) => {
          const imgData = canvas.toDataURL('image/png');
          const doc = new jsPDF('p', 'mm', 'a4');
          const imgProps = doc.getImageProperties(imgData);
          const pdfWidth = doc.internal.pageSize.getWidth();
          const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
          doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

          this.downloadingPDF = false;

          doc.save('bordereau.pdf');
          this.showSecondContainer = !this.showSecondContainer;
        });
      });
    } else {
      this.openSnackBar('Données non disponibles pour générer le PDF.');
    }
  }
  waitForDataToBeReady(): Promise<void> {
    return new Promise<void>((resolve) => {
      const interval = setInterval(() => {
        if (document.getElementById('pdfSection')) {
          clearInterval(interval);
          resolve();
        }
      }, 100);
    });
  }

  generateQRCode(doc: jsPDF, data: string) {
    const qrWidth = 50;
    const qrHeight = 50;
    const margin = 10;
    const x = (doc.internal.pageSize.getWidth() - qrWidth) / 2;
    const y = doc.internal.pageSize.getHeight() - qrHeight - margin;

    qrcode.toDataURL(data, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Erreur lors de la génération du QR code :', err);
        return;
      }
      doc.addImage(url, 'PNG', x, y, qrWidth, qrHeight);
    });
  }
}

