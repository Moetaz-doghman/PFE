import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Beneficiaire } from 'src/app/Models/Beneficiaire';
import { Prestation } from 'src/app/Models/Prestation';
import { Rapport_C_V_Optcien } from 'src/app/Models/Rapport_C_V_Optcien ';
import { User } from 'src/app/Models/User';
import { AdherantService } from 'src/app/Services/adherant.service';
import { PrestationService } from 'src/app/Services/prestation-service.service';
import { RapportServiceService } from 'src/app/Services/rapport-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';
import * as qrcode from 'qrcode';


@Component({
  selector: 'app-liste-prestation-controle',
  templateUrl: './liste-prestation-controle.component.html',
  styleUrls: ['./liste-prestation-controle.component.css']
})
export class ListePrestationControleComponent  implements OnInit  {


  prestations: Prestation[] = [];
  selectedPrestation: Prestation | null = null;
  selectedPrestations: Prestation | null = null;
  user:User ;
  beneficiaire: Beneficiaire;
  beneficiaire_rapport: Beneficiaire;
  rapportOpticien :Rapport_C_V_Optcien | null = null;
  today: Date = new Date();
  downloadingPDF: boolean = false;
  showSecondContainer: boolean = false;
  prestationRapport : Prestation | null = null;
  @ViewChild('pdfSection') pdfSection: ElementRef;
  qrCodeURL: string;


  printPDF() {
    const printContents = this.pdfSection.nativeElement.innerHTML;
    const originalContents = document.body.innerHTML;
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
  }



  constructor(private prestation_service :PrestationService,
    private storageService: StorageServiceService , private router:Router , private adherant_service:AdherantService,
    private rapportService: RapportServiceService ){}


  ngOnInit(): void {

    this.user = this.storageService.getUser();
    this.getPrestations()

  }

  getPrestations(): void {
    this.prestation_service.getPrestationsByUserControlleur(this.user.id)
      .subscribe(
        (data: Prestation[]) => {
          this.prestations = data;
          console.log('Prestations:', this.prestations);
        },
        error => {
          console.error('Erreur lors de la récupération des prestations:', error);
        }
      );
  }

  getRapportOpticien(prestationid :number): void {
    this.rapportService.findRapportByPrestationId(prestationid)
      .subscribe(
        (data : Rapport_C_V_Optcien) => {
          this.rapportOpticien = data;
          console.log('rapport:', this.rapportOpticien);
        },
        error => {
          console.error('Erreur lors de la récupération des prestations:', error);
        }
      );
  }


  showDetails(prestation: Prestation): void {
    let activePrestation = parseInt(prestation.idPrestation);
     this.prestation_service.getPrestationsById(activePrestation) .subscribe(
      (data : Prestation) => {
        this.selectedPrestation =data
        console.log('rapport:', this.selectedPrestation);
      },
      error => {
        console.error('Erreur lors de la récupération des prestations:', error);
      }
    );
    if (this.selectedPrestation.beneficiaireId) {
      let beneficiareid =parseInt(this.selectedPrestation.beneficiaireId);
      this.adherant_service.getBeneficiaireById(beneficiareid)
      .subscribe(
        (response) => {
          this.beneficiaire =response
        },
        (error) => {
          console.error('Error adding adherent', error);
        }
      );
    }
    else {
      this.beneficiaire = null ;
    }
  }

  showPrestationDetails(prestationId: number): void {
    this.router.navigate(['/menu/optc/ajouterRapport', prestationId]);
  }

  showPdf(prestation:Prestation): void {
    this.selectedPrestations = prestation;

    if (this.selectedPrestations.beneficiaireId) {
      let beneficiareid =parseInt(this.selectedPrestations.beneficiaireId);
      this.adherant_service.getBeneficiaireById(beneficiareid)
      .subscribe(
        (response) => {
          this.beneficiaire_rapport =response
        },
        (error) => {
          console.error('Error adding adherent', error);
        }
      );
    }
    else {
      this.beneficiaire_rapport = null ;
    }


    this.showSecondContainer = !this.showSecondContainer;
    this.prestation_service.getPrestationsById(this.selectedPrestations.id)
      .subscribe(
        (data : Prestation) => {
          this.prestationRapport = data;
          console.log('rapport:', this.rapportOpticien);
        },
        error => {
          console.error('Erreur lors de la récupération des prestations:', error);
        }
      );
    this.getRapportOpticien(this.selectedPrestations.id);
    // this.downloadingPDF = true;
    const qrData = `000${this.rapportOpticien.ref} `;
    qrcode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
      if (err) {
        console.error('Erreur lors de la génération du QR code :', err);
        return;
      }
      this.qrCodeURL = url;
    });
          if (this.selectedPrestations && this.prestationRapport && this.rapportOpticien) {
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
                doc.save('rapport.pdf');
                this.showSecondContainer = !this.showSecondContainer;
              });
            });
          }

      };


  toggleSecondContainer() {
    this.showSecondContainer = !this.showSecondContainer;
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






