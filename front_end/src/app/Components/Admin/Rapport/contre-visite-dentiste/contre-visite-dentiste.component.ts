import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import * as $ from 'jquery';
import {
  trigger,
  state,
  transition,
  style,
  animate,
} from '@angular/animations';
import { DataSharingService } from 'src/app/Services/data-sharing-service.service';
import { EActe, Prestation } from 'src/app/Models/Prestation';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NomenclatureService } from 'src/app/Services/nomenclature.service';
import { RapportDentisteCVService } from 'src/app/Services/rapport-dentiste-cv.service';
import { Router } from '@angular/router';
import * as qrcode from 'qrcode';

export const slideInOutAnimation = trigger('slideInOutAnimation', [
  transition(':enter', [
    style({ transform: 'translateX(100%)' }),
    animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' })),
  ]),
  transition(':leave', [
    animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' })),
  ]),
]);

@Component({
  selector: 'app-contre-visite-dentiste',
  templateUrl: './contre-visite-dentiste.component.html',
  styleUrls: ['./contre-visite-dentiste.component.css'],
  animations: [slideInOutAnimation],
})
export class ContreVisiteDentisteComponent implements OnInit {
  isTransitioning: boolean = false;
  groupedPrestations: { acte: string; prestations: Prestation[] }[] = [];
  currentGroupIndex: number = 0;
  today: Date = new Date();
  lastdent: string = '';
  nomenclatures: any[] = [];
  teeth = [
    { value: 'tooth-1', label: 'Dent 1' },
    { value: 'tooth-2', label: 'Dent 2' },
    { value: 'tooth-3', label: 'Dent 3' },
    { value: 'tooth-4', label: 'Dent 4' },
    { value: 'tooth-5', label: 'Dent 5' },
    { value: 'tooth-6', label: 'Dent 6' },
    { value: 'tooth-7', label: 'Dent 7' },
    { value: 'tooth-8', label: 'Dent 8' },
    { value: 'tooth-9', label: 'Dent 9' },
    { value: 'tooth-10', label: 'Dent 10' },
    { value: 'tooth-11', label: 'Dent 11' },
    { value: 'tooth-12', label: 'Dent 12' },
    { value: 'tooth-13', label: 'Dent 13' },
    { value: 'tooth-14', label: 'Dent 14' },
    { value: 'tooth-15', label: 'Dent 15' },
    { value: 'tooth-16', label: 'Dent 16' },
    { value: 'tooth-17', label: 'Dent 17' },
    { value: 'tooth-18', label: 'Dent 18' },
    { value: 'tooth-19', label: 'Dent 19' },
    { value: 'tooth-20', label: 'Dent 20' },
    { value: 'tooth-21', label: 'Dent 21' },
    { value: 'tooth-22', label: 'Dent 22' },
    { value: 'tooth-23', label: 'Dent 23' },
    { value: 'tooth-24', label: 'Dent 24' },
    { value: 'tooth-25', label: 'Dent 25' },
    { value: 'tooth-26', label: 'Dent 26' },
    { value: 'tooth-27', label: 'Dent 27' },
    { value: 'tooth-28', label: 'Dent 28' },
    { value: 'tooth-29', label: 'Dent 29' },
    { value: 'tooth-30', label: 'Dent 30' },
    { value: 'tooth-31', label: 'Dent 31' },
    { value: 'tooth-32', label: 'Dent 32' },
  ];
  selectedTooth: string = '';
  codeActe: string = '';
  cotation: string = '';
  avisMedical: string = '';
  observation: string = '';
  selectedDate: Date;
  actesData: any[] = [];
  actesTableData1: any[] = [];
  actesTableData2: any[] = [];
  actesTableData3: any[] = [];
  downloadingPDF: boolean = false;
  showSecondContainer: boolean = false;
  nextButtonDisabled: boolean = true;
  doneButtonDisabled: boolean = true;
  codeActesOptions: string[] = [];
  cotationsOptions: string[] = [];
  avisMedicalOptions: string[] = [];
  @ViewChild('qrCanvas') qrCanvas: ElementRef;
  qrCodeURL: string;
  reportReference: string;
  lastSelectedTeeth: string[] = [];


  constructor(
    private dataSharingService: DataSharingService,
    private snackBar: MatSnackBar,
    private nomenclatureService: NomenclatureService,
    private rapportDentisteCVService: RapportDentisteCVService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.lastSelectedTeeth = Array(this.groupedPrestations.length).fill('');

    const selectedPrestations = this.dataSharingService.getSelectedPrestations();
    if (!selectedPrestations || selectedPrestations.length === 0) {
      this.openSnackBar('Vous devez selectionner des prestations contre visite');
      this.router.navigate(['/menu/dentc/rapport']);
      return;
    }

    this.groupPrestationsByActe(selectedPrestations);
    this.loadNomenclatureDataForActe();
    this.updateButtonStatus();
  }

  groupPrestationsByActe(prestations: Prestation[]): void {
    const groupedPrestationsMap = new Map<string, Prestation[]>();
    prestations.forEach((prestation) => {
      prestation.actes.forEach((acte) => {
        if (acte.nom !== 'Consultation') {
          const acteNom = acte.nom;
          if (!groupedPrestationsMap.has(acteNom)) {
            groupedPrestationsMap.set(acteNom, []);
          }
          groupedPrestationsMap.get(acteNom).push(prestation);
        }
      });
    });

    groupedPrestationsMap.forEach((prestations, acte) => {
      for (let i = 0; i < prestations.length; i++) {
        this.groupedPrestations.push({ acte, prestations: [prestations[i]] });
      }
    });
  }

  updateTables(): void {
    const actesTableData = this.actesData.map((formData) => ({
      date: formData.date,
      dent: formData.dent,
      codeActe: formData.codeActe,
      cotation: formData.cotation,
      avisMedical: formData.avisMedical,
      observation: formData.observation,
    }));

    this.actesTableData1 = actesTableData;
    this.actesTableData2 = actesTableData;
    this.actesTableData3 = actesTableData;
  }

  submitForms(): void {
    let adherantNomPrenom = '';

    if (this.groupedPrestations[this.currentGroupIndex].prestations[0].beneficiaire == null) {
      adherantNomPrenom = this.groupedPrestations[this.currentGroupIndex].prestations[0].adherant.nom + ' ' +
        this.groupedPrestations[this.currentGroupIndex].prestations[0].adherant.prenom;
    } else {
      adherantNomPrenom = this.groupedPrestations[this.currentGroupIndex].prestations[0].beneficiaire.nom + ' ' +
        this.groupedPrestations[this.currentGroupIndex].prestations[0].beneficiaire.prenom;
    }

    const formData = {
      acte: this.groupedPrestations[this.currentGroupIndex].acte,
      adherantNom: adherantNomPrenom,
      prestataireNom:
        this.groupedPrestations[this.currentGroupIndex].prestations[0].user.nom,
      userId:
        this.groupedPrestations[this.currentGroupIndex].prestations[0].user.id,
      adhesion:
        this.groupedPrestations[this.currentGroupIndex].prestations[0].adherant
          .matricule,
      numero:
        this.groupedPrestations[this.currentGroupIndex].prestations[0].adherant
          .cin,
      prestationId:
        this.groupedPrestations[this.currentGroupIndex].prestations[0].id,
      dent: this.selectedTooth,
      codeActe: this.codeActe,
      cotation: this.cotation,
      avisMedical: this.avisMedical,
      date: this.formatDate(this.selectedDate)
        ? this.formatDate(this.selectedDate)
        : '',
      dateRapport: this.formatDate(this.today),
    };
    this.actesData.push(formData);

    switch (formData.acte) {
      case 'SoinsDentaire':
        this.actesTableData1.push(formData);
        break;
      case 'Prothese':
        this.actesTableData2.push(formData);
        break;
      case 'ODF':
        this.actesTableData3.push(formData);
        break;
      default:
        break;
    }

    this.selectedTooth = '';
    this.codeActe = '';
    this.cotation = '';
    this.avisMedical = '';
    this.selectedDate = null;

    this.nextForm();
  }

  doneForm(): void {
    this.submitForms();
    this.enregistrerContreVisite();
  }

  toggleSecondContainer() {
    this.showSecondContainer = !this.showSecondContainer;
  }

  downloadPDF(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.showSecondContainer = !this.showSecondContainer;
      this.downloadingPDF = true;

      const qrData = `Référence: ${this.reportReference}`;
      qrcode.toDataURL(qrData, { errorCorrectionLevel: 'H' }, (err, url) => {
        if (err) {
          console.error('Erreur lors de la génération du QR code :', err);
          this.downloadingPDF = false;
          this.showSecondContainer = !this.showSecondContainer;
          return reject(err);
        }
        this.qrCodeURL = url;

        this.waitForDataToBeReady()
          .then(() => {
            const element = document.getElementById('pdfSection');
            if (!element) {
              this.downloadingPDF = false;
              this.showSecondContainer = !this.showSecondContainer;
              return reject('Element not found');
            }

            setTimeout(() => {
              html2canvas(element)
                .then((canvas) => {
                  const imgData = canvas.toDataURL('image/png');
                  const doc = new jsPDF('p', 'mm', 'a4');
                  const pdfWidth = doc.internal.pageSize.getWidth();
                  const pageHeight = doc.internal.pageSize.getHeight();
                  const imgProps = doc.getImageProperties(imgData);
                  const imgHeight =
                    (imgProps.height * pdfWidth) / imgProps.width;

                  let position = 0;

                  while (position < imgHeight) {
                    const remainingHeight = imgHeight - position;
                    const heightToPrint = Math.min(pageHeight, remainingHeight);

                    const canvasPartial = document.createElement('canvas');
                    canvasPartial.width = canvas.width;
                    canvasPartial.height =
                      canvas.height * (heightToPrint / imgHeight);

                    const ctx = canvasPartial.getContext('2d');
                    if (ctx) {
                      ctx.drawImage(
                        canvas,
                        0,
                        position * (canvas.height / imgHeight),
                        canvas.width,
                        canvas.height * (heightToPrint / imgHeight),
                        0,
                        0,
                        canvasPartial.width,
                        canvasPartial.height
                      );

                      const imgDataPartial =
                        canvasPartial.toDataURL('image/png');
                      doc.addImage(
                        imgDataPartial,
                        'PNG',
                        0,
                        0,
                        pdfWidth,
                        heightToPrint
                      );
                      if (position + pageHeight < imgHeight) {
                        doc.addPage();
                      }
                      position += pageHeight;
                    } else {
                      this.downloadingPDF = false;
                      this.showSecondContainer = !this.showSecondContainer;
                      return reject('Canvas context not available');
                    }
                  }

                  doc.save('contre-visite.pdf');
                  this.downloadingPDF = false;
                  this.showSecondContainer = !this.showSecondContainer;
                  resolve();
                })
                .catch((err) => {
                  this.downloadingPDF = false;
                  this.showSecondContainer = !this.showSecondContainer;
                  reject(err);
                });
            }, 1000);
          })
          .catch((err) => {
            this.downloadingPDF = false;
            this.showSecondContainer = !this.showSecondContainer;
            reject(err);
          });
      });
    });
  }

  private waitForDataToBeReady(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 500);
    });
  }

  onDentSelectionChange(event: MatSelectChange): void {
    const selected: string = event.value as string;

    if (this.lastSelectedTeeth[this.currentGroupIndex] !== '') {
      $('.' + this.lastSelectedTeeth[this.currentGroupIndex] + '-parent').css('fill', 'none');
    }
    $('.' + selected + '-parent').css('fill', 'red');

    this.lastSelectedTeeth[this.currentGroupIndex] = selected;
  }

  nextForm(): void {
    if (
      !this.isTransitioning &&
      this.currentGroupIndex < this.groupedPrestations.length - 1
    ) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.currentGroupIndex++;
        this.loadNomenclatureDataForActe();
        this.resetForm();
        this.isTransitioning = false;
      }, 500);
    }
  }

  previousForm(): void {
    if (!this.isTransitioning && this.currentGroupIndex > 0) {
      this.isTransitioning = true;
      setTimeout(() => {
        this.currentGroupIndex--;
        this.loadNomenclatureDataForActe();
        this.isTransitioning = false;
      }, 500);
    }
  }

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    };
    return new Date(date).toLocaleDateString('fr-FR', options);
  }

  updateButtonStatus(): void {
    this.nextButtonDisabled =
      !this.selectedTooth ||
      !this.codeActe ||
      !this.cotation ||
      !this.avisMedical ||
      !this.selectedDate;

    this.doneButtonDisabled =
      !this.selectedTooth ||
      !this.codeActe ||
      !this.cotation ||
      !this.avisMedical ||
      !this.observation ||
      !this.selectedDate;
  }

  resetForm(): void {
    this.selectedTooth = '';
    this.codeActe = '';
    this.cotation = '';
    this.avisMedical = '';
    this.observation = '';
    this.selectedDate = null;
    this.updateButtonStatus();
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, 'Fermer', {
      duration: 5000,
    });
  }

  loadNomenclatureDataForActe(): void {
    if (this.groupedPrestations.length === 0) {
      console.error('Aucune prestation groupée trouvée.');
      return;
    }

    const acteNom = this.groupedPrestations[this.currentGroupIndex]?.acte;

    if (!acteNom) {
      console.error(
        'Aucun acte trouvé pour l’index actuel:',
        this.currentGroupIndex
      );
      return;
    }

    this.nomenclatureService
      .findByActeDentaire_Nom(acteNom)
      .subscribe((nomenclatures: any[]) => {
        this.nomenclatures = nomenclatures;
        this.codeActesOptions = Array.from(
          new Set(nomenclatures.map((nomenclature) => nomenclature.codeActe))
        );
        this.cotationsOptions = Array.from(
          new Set(nomenclatures.map((nomenclature) => nomenclature.cotation))
        );
        this.avisMedicalOptions = Array.from(
          new Set(nomenclatures.map((nomenclature) => nomenclature.avisMedical))
        );
      });
  }

  onSelectionChange(event: MatSelectChange, field: string): void {
    const selectedValue = event.value;
    let nomenclature;

    switch (field) {
      case 'codeActe':
        nomenclature = this.nomenclatures.find(
          (n) => n.codeActe === selectedValue
        );
        break;
      case 'cotation':
        nomenclature = this.nomenclatures.find(
          (n) => n.cotation === selectedValue
        );
        break;
      case 'avisMedical':
        nomenclature = this.nomenclatures.find(
          (n) => n.avisMedical === selectedValue
        );
        break;
    }

    if (nomenclature) {
      this.codeActe = nomenclature.codeActe;
      this.cotation = nomenclature.cotation;
      this.avisMedical = nomenclature.avisMedical;
    }
  }

  async enregistrerContreVisite(): Promise<void> {
    const commonObservation = this.observation;

    const actesTableData1WithObservation = this.actesTableData1.map((data) => ({
      ...data,
      observation: commonObservation,
    }));
    const actesTableData2WithObservation = this.actesTableData2.map((data) => ({
      ...data,
      observation: commonObservation,
    }));
    const actesTableData3WithObservation = this.actesTableData3.map((data) => ({
      ...data,
      observation: commonObservation,
    }));

    const contreVisiteData = {
      actesTableData1: actesTableData1WithObservation,
      actesTableData2: actesTableData2WithObservation,
      actesTableData3: actesTableData3WithObservation,
    };

    console.log('contreVisiteData:', contreVisiteData);

    const rapports1 = contreVisiteData.actesTableData1.map((item) => item);
    const rapports2 = contreVisiteData.actesTableData2.map((item) => item);
    const rapports3 = contreVisiteData.actesTableData3.map((item) => item);

    console.log('rapports1:', rapports1);
    console.log('rapports2:', rapports2);
    console.log('rapports3:', rapports3);

    const rapports = [...rapports1, ...rapports2, ...rapports3];

    console.log('rapports:', rapports);

    try {
      const result = await this.rapportDentisteCVService.saveContreVisite(rapports).toPromise();
      const reference = result[0];
      console.log('Référence du rapport:', reference);

      this.reportReference = reference;
      console.log(this.reportReference);
      await this.downloadPDF();
      this.resetForm();
      this.openSnackBar('Contre visite successfully created and pdf Generated');
      this.router.navigate(['/menu/dentc/rapport']);
    } catch (error) {
      console.error('Failed to save data:', error);
      this.openSnackBar('Erreur lors de creation');
      this.router.navigate(['/menu/dentc/rapport']);
    }
  }
}
