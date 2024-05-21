import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {MatCardModule} from '@angular/material/card';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MainComponent } from './Components/main/main.component';
import { MenuComponent } from './Components/menu/menu.component';
import { ListePsComponent } from './Components/Admin/liste-ps/liste-ps.component';
import { AjouterPsComponent } from './Components/Admin/ajouter-ps/ajouter-ps.component';
import { LoginComponent } from './Components/login/login.component';
import { AjoutPrestationComponent } from './Components/User/ajout-prestation/ajout-prestation.component';
import { ForgotPasswordComponent } from './Components/forgot-password/forgot-password.component';
import { AjoutVisiteDentaireComponent } from './Components/ajout-visite-dentaire/ajout-visite-dentaire.component';
import { ProfilUserComponent } from './Components/User/profil-user/profil-user.component';
import { AjouterContreVisiteOpticienComponent } from './Components/opticienControlleur/ajouter-contre-visite-opticien/ajouter-contre-visite-opticien.component';
import { ListAdherantsComponent } from './Components/Admin/list-adherants/list-adherants.component';
import { ResumeDialogComponent } from './Components/Dentiste/resume-dialog/resume-dialog.component';
import { ListPrestationDentisteComponent } from './Components/Admin/Dentiste/list-prestation-dentiste/list-prestation-dentiste.component';
import { DetailPrestationComponent } from './Components/Admin/Dentiste/detail-prestation/detail-prestation.component';
import { ModifierPrestationComponent } from './Components/Admin/Dentiste/modifier-prestation/modifier-prestation.component';
import { ListePrestationControleComponent } from './Components/opticienControlleur/liste-prestation-controle/liste-prestation-controle.component';
import { SimpleDateFormatPipe } from './Pipe/simple-date-format.pipe';
import { BeneficiaireListComponent } from './Components/Admin/Beneficiaire/beneficiaire-list/beneficiaire-list.component';
import { AjouterBeneficiaireComponent } from './Components/Admin/Beneficiaire/ajouter-beneficiaire/ajouter-beneficiaire.component';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'; // ou importez l'un des autres modules selon votre choix
import { MatSidenavModule } from '@angular/material/sidenav';

import { AjouterPrestationOpticienComponent } from './Components/Opticien/ajouter-prestation-opticien/ajouter-prestation-opticien.component';
import { VoirDetailComponent } from './Components/Opticien/voir-detail/voir-detail.component';
import { PrestationFormComponent } from './Components/Opticien/prestation-form/prestation-form.component';

import { ModifierBeneficiaireComponent } from './Components/Admin/Beneficiaire/modifier-beneficiaire/modifier-beneficiaire.component';
import { OrdonnanceComponent } from './Components/PS/ordonnance/ordonnance.component';
import { BordereauFactureComponent } from './Components/PS/bordereau-facture/bordereau-facture.component';
import { ListBordereauComponent } from './Components/Admin/Bordereau/list-bordereau/list-bordereau.component';
import { DetailBordereauComponent } from './Components/Admin/Bordereau/detail-bordereau/detail-bordereau.component';
import { ContreVisiteDentisteComponent } from './Components/Admin/Rapport/contre-visite-dentiste/contre-visite-dentiste.component';
import { CreateComponent } from './Components/Admin/Rapport/create/create.component';
import { AjoutRapportComponent } from './Components/opticienControlleur/ajout-rapport/ajout-rapport.component';
import { ModifierAdherentComponent } from './Components/Admin/modifier-adherent/modifier-adherent.component';

import { AjoiuterAdherantComponent } from './Components/Admin/ajoiuter-adherant/ajouter-adherant.component';

import { AjouterContreVisiteDentisteComponent } from './Components/DentisteControlleur/ajouter-contre-visite-dentiste/ajouter-contre-visite-dentiste.component';
import { ListePrestationDentisteControlleurComponent } from './Components/DentisteControlleur/liste-prestation-dentiste-controlleur/liste-prestation-dentiste-controlleur.component';
import { HistoriqueComponent } from './Components/Admin/Rapport/historique/historique.component';
import { ListNomenclatureComponent } from './Components/Admin/Actes/Nomenclature/list-nomenclature/list-nomenclature.component';
import { AddNomenclatureComponent } from './Components/Admin/Actes/Nomenclature/add-nomenclature/add-nomenclature.component';
import { UpdateNomenclatureComponent } from './Components/Admin/Actes/Nomenclature/update-nomenclature/update-nomenclature.component';
import { PrestationNonfacturesComponent } from './Components/opticienControlleur/prestation-nonfactures/prestation-nonfactures.component';
import { BordereauFacturesComponent } from './Components/opticienControlleur/bordereau-factures/bordereau-factures.component';
import { ReclamationComponent } from './Components/PS/reclamation/reclamation.component';
import { ListReclamationComponent } from './Components/Admin/liste-reclamation/liste-reclamation.component';


@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    MenuComponent,
    ListePsComponent,
    AjouterPsComponent,
    LoginComponent,
    AjoutPrestationComponent,
    ForgotPasswordComponent,
    AjoutVisiteDentaireComponent,
    ProfilUserComponent,
    AjouterContreVisiteOpticienComponent,
    ResumeDialogComponent,
    AjoiuterAdherantComponent,
    ListAdherantsComponent,
    ListPrestationDentisteComponent,
    DetailPrestationComponent,
    ModifierPrestationComponent,
    ListePrestationControleComponent,
    SimpleDateFormatPipe,
    BeneficiaireListComponent,
    AjouterBeneficiaireComponent,
    AjouterPrestationOpticienComponent,
    VoirDetailComponent,
    PrestationFormComponent,
    ModifierBeneficiaireComponent,
    OrdonnanceComponent,
    BordereauFactureComponent,
    ListBordereauComponent,
    DetailBordereauComponent,
    ContreVisiteDentisteComponent,
    CreateComponent,
    AjoutRapportComponent,
    ModifierAdherentComponent,
    AjouterContreVisiteDentisteComponent,
    ListePrestationDentisteControlleurComponent,
    HistoriqueComponent,
    ListNomenclatureComponent,
    AddNomenclatureComponent,
    UpdateNomenclatureComponent,
    PrestationNonfacturesComponent,
    BordereauFacturesComponent,
    ReclamationComponent,
    ListReclamationComponent


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogModule,
    MatCheckboxModule,
    MatCardModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSidenavModule,

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
