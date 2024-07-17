import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RapportDentisteCVService } from 'src/app/Services/rapport-dentiste-cv.service';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import * as $ from 'jquery';
import * as qrcode from 'qrcode';
import { StorageServiceService } from 'src/app/Services/storage-service.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css'],
})
export class HistoriqueComponent implements OnInit {
  combinedRapports: any[] = [];
  dataSource = new MatTableDataSource<any>([]);
  totalItems = 0;
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 15, 20, 25, 30, 35, 40];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  currentPage = 0;
  selectedRapport: any = null;
  selectedRapportFiltered: any = null;
  qrCodeURL: string | null = null;
  filterDate: string = '';

  constructor(
    private rapportService: RapportDentisteCVService,
    private router: Router,
    private snackBar: MatSnackBar,
    private storageService: StorageServiceService
  ) {}

  ngOnInit(): void {
    this.getCombinedRapports();
  }

  getCombinedRapports(): void {
    this.rapportService
      .getCombinedRapports(this.storageService.getUser().id)
      .subscribe(
        (data) => {
          this.combinedRapports = data.map((rapport) => ({
            ...rapport,
            isDownloading: false,
          }));
          console.log(this.combinedRapports);
          this.totalItems = this.combinedRapports.length;
          this.dataSource.data = this.combinedRapports;
        },
        (error) => {
          console.error('Error fetching combined rapports:', error);
        }
      );
  }

  onPageChange(event: PageEvent): void {
    const startIndex = event.pageIndex * event.pageSize;
    const endIndex = startIndex + event.pageSize;
    this.dataSource.data = this.combinedRapports.slice(startIndex, endIndex);
    this.currentPage = event.pageIndex;
  }

  addReport() {}

  async showPdf(rapport: any): Promise<void> {
    rapport.isDownloading = true;

    this.selectedRapport = rapport;
    this.selectedRapportFiltered = {
      soinsDentaires: rapport.details.filter(
        (detail) => detail.acte === 'SoinsDentaire'
      ),
      protheses: rapport.details.filter((detail) => detail.acte === 'Prothese'),
      odf: rapport.details.filter((detail) => detail.acte === 'ODF'),
    };

    const toothList = this.extractTeeth(this.selectedRapport);
    console.log('Liste des dents:', toothList);

    try {
      await this.dentRempli(toothList);
      await this.generateQRCode(rapport.ref);

      setTimeout(() => {
        const data = document.getElementById('pdfSection');
        if (data) {
          html2canvas(data).then((canvas) => {
            const imgWidth = 208;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;

            const contentDataURL = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const position = 0;
            pdf.addImage(
              contentDataURL,
              'PNG',
              0,
              position,
              imgWidth,
              imgHeight
            );
            pdf.save('RapportDeContreVisite.pdf');

            rapport.isDownloading = false; 
            this.selectedRapport = null; 
          });
        }
      }, 1000);
    } catch (error) {
      console.error('Erreur lors du traitement du rapport:', error);
      rapport.isDownloading = false; // Réinitialiser en cas d'erreur
    }
  }

  extractTeeth(rapport: any): string[] {
    const teeth: string[] = [];
    rapport.details.forEach((detail: any) => {
      if (detail.dent) {
        teeth.push(detail.dent);
      }
    });
    return teeth;
  }

  async dentRempli(toothList: string[]): Promise<void> {
    for (const tooth of toothList) {
      await this.colorToothAsync(tooth);
    }
  }

  colorToothAsync(tooth: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const checkIfElementExists = setInterval(() => {
        const element = document.querySelector('.' + tooth + '-parent');
        if (element) {
          console.log(`Coloring tooth: ${tooth}`);
          $(element).css('fill', 'red');
          clearInterval(checkIfElementExists);
          console.log(`Finished coloring tooth: ${tooth}`);
          resolve();
        } else {
          console.log(`Element not found for tooth: ${tooth}`);
        }
      }, 100);
    });
  }

  generateQRCode(reference: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const qrData = `Référence: ${reference}`;
      qrcode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (err) {
          console.error('Erreur lors de la génération du QR code :', err);
          return reject(err);
        }
        this.qrCodeURL = url;
        resolve();
      });
    });
  }
}
