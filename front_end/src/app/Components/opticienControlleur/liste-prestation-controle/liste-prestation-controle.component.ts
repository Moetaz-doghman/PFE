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
export class ListePrestationControleComponent implements OnInit {

  prestations: Prestation[] = [];
  selectedPrestation: Prestation | null = null;
  selectedPrestations: Prestation | null = null;
  user: User;
  beneficiaire: Beneficiaire;
  beneficiaire_rapport: Beneficiaire;
  rapportOpticien: Rapport_C_V_Optcien | null = null;
  downloadingPDF: { [key: number]: boolean } = {};
  showSecondContainer: boolean = false;
  prestationRapport: Prestation | null = null;
  @ViewChild('pdfSection') pdfSection: ElementRef;
  qrCodeURL: string;
  today: Date = new Date();


  constructor(
    private prestation_service: PrestationService,
    private storageService: StorageServiceService,
    private router: Router,
    private adherant_service: AdherantService,
    private rapportService: RapportServiceService
  ) {}

  ngOnInit(): void {
    this.user = this.storageService.getUser();
    this.getPrestations();
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

  showDetails(prestation: Prestation): void {
    let activePrestation = parseInt(prestation.idPrestation);
    this.prestation_service.getPrestationsById(activePrestation).subscribe(
      (data: Prestation) => {
        this.selectedPrestation = data;
        console.log('rapport:', this.selectedPrestation);
      },
      error => {
        console.error('Erreur lors de la récupération des prestations:', error);
      }
    );
    if (this.selectedPrestation.beneficiaireId) {
      let beneficiareid = parseInt(this.selectedPrestation.beneficiaireId);
      this.adherant_service.getBeneficiaireById(beneficiareid).subscribe(
        (response) => {
          this.beneficiaire = response;
        },
        (error) => {
          console.error('Error adding adherent', error);
        }
      );
    } else {
      this.beneficiaire = null;
    }
  }

  showPrestationDetails(prestationId: number): void {
    this.router.navigate(['/menu/optc/ajouterRapport', prestationId]);
  }

  showPdf(prestation: Prestation): void {
    this.downloadingPDF[prestation.id] = true;
    this.selectedPrestations = prestation;

    const fetchBeneficiaire = () => {
        return new Promise<void>((resolve, reject) => {
            if (this.selectedPrestations && this.selectedPrestations.beneficiaireId) {
                let beneficiareid = parseInt(this.selectedPrestations.beneficiaireId);
                this.adherant_service.getBeneficiaireById(beneficiareid).subscribe(
                    (response) => {
                        this.beneficiaire_rapport = response;
                        resolve();
                    },
                    (error) => {
                        console.error('Error adding adherent', error);
                        reject(error);
                    }
                );
            } else {
                this.beneficiaire_rapport = null;
                resolve();
            }
        });
    };

    const fetchPrestationRapport = () => {
        return new Promise<void>((resolve, reject) => {
            if (this.selectedPrestations) {
                this.prestation_service.getPrestationsById(this.selectedPrestations.id).subscribe(
                    (data: Prestation) => {
                        this.prestationRapport = data;
                        resolve();
                    },
                    (error) => {
                        console.error('Erreur lors de la récupération des prestations:', error);
                        reject(error);
                    }
                );
            } else {
                this.prestationRapport = null;
                resolve();
            }
        });
    };

    const fetchRapportOpticien = () => {
        return new Promise<void>((resolve, reject) => {
            if (this.selectedPrestations) {
                this.rapportService.findRapportByPrestationId(this.selectedPrestations.id).subscribe(
                    (data: Rapport_C_V_Optcien) => {
                        this.rapportOpticien = data;
                        resolve();
                    },
                    (error) => {
                        console.error('Erreur lors de la récupération des prestations:', error);
                        reject(error);
                    }
                );
            } else {
                this.rapportOpticien = null;
                resolve();
            }
        });
    };

    const generateQRCode = () => {
        return new Promise<void>((resolve, reject) => {
            if (this.rapportOpticien) {
                const qrData = `000${this.rapportOpticien.ref} `;
                qrcode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
                    if (err) {
                        console.error('Erreur lors de la génération du QR code :', err);
                        reject(err);
                    } else {
                        this.qrCodeURL = url;
                        resolve();
                    }
                });
            } else {
                this.qrCodeURL = '';
                resolve();
            }
        });
    };

    const generatePdfs = () => {
      return new Promise<void>((resolve) => {
          this.waitForDataToBeReady().then(() => {
              const element = document.getElementById('pdfSection');
              html2canvas(element).then((canvas) => {
                  const imgData = canvas.toDataURL('image/png');
                  const doc = new jsPDF('p', 'mm', 'a4');
                  const imgProps = doc.getImageProperties(imgData);
                  const pdfWidth = doc.internal.pageSize.getWidth();
                  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                  doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                  doc.save('rapport.pdf');
                  this.downloadingPDF[prestation.id] = false;
                  this.showSecondContainer = !this.showSecondContainer;
                  resolve();
              });
          });
      });
  };



    const generatePdf = () => {
        return new Promise<void>((resolve) => {
            const element = document.getElementById('pdfSection');
            html2canvas(element).then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const doc = new jsPDF('p', 'mm', 'a4');
                const imgProps = doc.getImageProperties(imgData);
                const pdfWidth = doc.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
                doc.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                doc.save('rapport.pdf');
                this.downloadingPDF[prestation.id] = false;
                this.showSecondContainer = !this.showSecondContainer;
                resolve();
            });
        });
    };

    this.downloadingPDF[prestation.id] = true;
    this.showSecondContainer = true;

    Promise.all([fetchBeneficiaire(), fetchPrestationRapport(), fetchRapportOpticien()])
        .then(generateQRCode)
        .then(generatePdfs)
        .catch(error => {
            console.error('Error in fetching data:', error);
            this.downloadingPDF[prestation.id] = false;
        });
}


private waitForDataToBeReady(): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 500);
  });
}
}
