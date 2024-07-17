import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './Components/main/main.component';
import { MenuComponent } from './Components/menu/menu.component';
import { ListePsComponent } from './Components/Admin/liste-ps/liste-ps.component';
import { AjouterPsComponent } from './Components/Admin/ajouter-ps/ajouter-ps.component';
import { LoginComponent } from './Components/login/login.component';
import { AjoutPrestationComponent } from './Components/User/ajout-prestation/ajout-prestation.component';
import { ForgotPasswordComponent } from './Components/forgot-password/forgot-password.component';
import { ProfilUserComponent } from './Components/User/profil-user/profil-user.component';
import { ListAdherantsComponent } from './Components/Admin/list-adherants/list-adherants.component';
import { AjouterContreVisiteOpticienComponent } from './Components/opticienControlleur/ajouter-contre-visite-opticien/ajouter-contre-visite-opticien.component';
import { ListPrestationDentisteComponent } from './Components/Admin/Dentiste/list-prestation-dentiste/list-prestation-dentiste.component';
import { DetailPrestationComponent } from './Components/Admin/Dentiste/detail-prestation/detail-prestation.component';
import { ModifierPrestationComponent } from './Components/Admin/Dentiste/modifier-prestation/modifier-prestation.component';
import { ListePrestationControleComponent } from './Components/opticienControlleur/liste-prestation-controle/liste-prestation-controle.component';
import { BeneficiaireListComponent } from './Components/Admin/Beneficiaire/beneficiaire-list/beneficiaire-list.component';
import { AjouterBeneficiaireComponent } from './Components/Admin/Beneficiaire/ajouter-beneficiaire/ajouter-beneficiaire.component';
import { AjouterPrestationOpticienComponent } from './Components/Opticien/ajouter-prestation-opticien/ajouter-prestation-opticien.component';
import { ModifierBeneficiaireComponent } from './Components/Admin/Beneficiaire/modifier-beneficiaire/modifier-beneficiaire.component';
import { OrdonnanceComponent } from './Components/PS/ordonnance/ordonnance.component';
import { BordereauFactureComponent } from './Components/PS/bordereau-facture/bordereau-facture.component';
import { ListBordereauComponent } from './Components/Admin/Bordereau/list-bordereau/list-bordereau.component';
import { DetailBordereauComponent } from './Components/Admin/Bordereau/detail-bordereau/detail-bordereau.component';
import { ContreVisiteDentisteComponent } from './Components/Admin/Rapport/contre-visite-dentiste/contre-visite-dentiste.component';
import { CreateComponent } from './Components/Admin/Rapport/create/create.component';
import { ModifierAdherentComponent } from './Components/Admin/modifier-adherent/modifier-adherent.component';
import { OpticienGuard } from './Guards/opticien.guard';
import { AjoiuterAdherantComponent } from './Components/Admin/ajoiuter-adherant/ajouter-adherant.component';
import { AjoutRapportComponent } from './Components/opticienControlleur/ajout-rapport/ajout-rapport.component';
import { HistoriqueComponent } from './Components/Admin/Rapport/historique/historique.component';
import { ListNomenclatureComponent } from './Components/Admin/Actes/Nomenclature/list-nomenclature/list-nomenclature.component';
import { AddNomenclatureComponent } from './Components/Admin/Actes/Nomenclature/add-nomenclature/add-nomenclature.component';
import { UpdateNomenclatureComponent } from './Components/Admin/Actes/Nomenclature/update-nomenclature/update-nomenclature.component';
import { AjouterContreVisiteDentisteComponent } from './Components/DentisteControlleur/ajouter-contre-visite-dentiste/ajouter-contre-visite-dentiste.component';
import { PrestationNonfacturesComponent } from './Components/opticienControlleur/prestation-nonfactures/prestation-nonfactures.component';
import { BordereauFacturesComponent } from './Components/opticienControlleur/bordereau-factures/bordereau-factures.component';
import { ReclamationComponent } from './Components/PS/reclamation/reclamation.component';
import { ListReclamationComponent } from './Components/Admin/liste-reclamation/liste-reclamation.component';
import { AdminGuard } from './Guards/admin.guard';
import { HomeComponent } from './Components/home/home.component';
import { AuthGuard } from './Guards/auth.guard';
import { DentistGuard } from './Guards/dentist.guard';
import { DentisteControleurGuard } from './Guards/dentiste-controleur.guard';
import { OpticienControleurGuard } from './Guards/opticien-controleur.guard';
import { ListPrestationContreVComponent } from './Components/Admin/Dentiste/list-prestation-contre-v/list-prestation-contre-v.component';
import { ListAssuranceComponent } from './Components/Admin/Assurance/list-assurance/list-assurance.component';
import { AjouterAssuranceComponent } from './Components/Admin/Assurance/ajouter-assurance/ajouter-assurance.component';
import { ModifierAssuranceComponent } from './Components/Admin/Assurance/modifier-assurance/modifier-assurance.component';
import { HistoriquePrestationComponent } from './Components/Dentiste/historique-prestation/historique-prestation.component';
import { HistoriquePrestationOptComponent } from './Components/Opticien/historique-prestation-opt/historique-prestation-opt.component';
import { AjouterReclamationComponent } from './Components/Ps/ajouter-reclamation/ajouter-reclamation.component';
import { ListBordereauContreVisiteComponent } from './Components/Admin/Bordereau/list-bordereau-contre-visite/list-bordereau-contre-visite.component';
import { ChangePasswordComponent } from './Components/User/change-password/change-password.component';


const routes: Routes = [

  { path: "", component: LoginComponent,
  canActivate:[AuthGuard]
},
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'forgot-password',
    component: ForgotPasswordComponent,
  },

  {
    path: 'menu',
    component: MenuComponent,
    children: [
      {
        path: 'admin',
        canActivate:[AdminGuard],


        children:[
          {
            path: 'ajoutps',
            component: AjouterPsComponent,
          },
          {
            path: 'ps',
            component: ListePsComponent,
          },
          {
            path: 'ajoutadherant',
            component: AjoiuterAdherantComponent,
          },
          {
            path: 'adherants',
            component: ListAdherantsComponent,
          },
          {
            path: 'modifierAdherent/:id',
            component: ModifierAdherentComponent,
          },

          {
            path: 'prestationDentist',
            component: ListPrestationDentisteComponent,
          },
          {
            path: 'prestationCV',
            component: ListPrestationContreVComponent,
          },
          {
            path: 'prestationDentist/:id',
            component: DetailPrestationComponent,
          },
          {
            path: 'modifier-prestation/:id',
            component: ModifierPrestationComponent,
          },
          {
            path: 'beneficiaire',
            component: BeneficiaireListComponent,
          },
          {
            path: 'ajouterBeneficiaire',
            component: AjouterBeneficiaireComponent,
          },
          {
            path: 'modifierBeneficiaire/:id',
            component: ModifierBeneficiaireComponent,
          },
          {
            path: 'assurance',
            component: ListAssuranceComponent,
          },
          {
            path: 'ajouterAssurance',
            component: AjouterAssuranceComponent,
          },
          {
            path: 'modifierAssurance/:id',
            component: ModifierAssuranceComponent,
          },
          {
            path: 'bordereaux',
            component: ListBordereauComponent
          },
          {
            path: 'bordereauxCV',
            component: ListBordereauContreVisiteComponent
          },
          {
            path: 'bordereauDetail/:id',
            component : DetailBordereauComponent
          },
          {
            path: 'listNomenclature',
            component: ListNomenclatureComponent,
          },
          {
            path: 'nomenclature/add',
            component: AddNomenclatureComponent,
          },
          {
            path: 'modifierNomenclature/:id',
           component: UpdateNomenclatureComponent
          },
          {
            path: 'reclamations',
           component: ListReclamationComponent
          },

        ],
      },
      {
        path: 'opt',
        canActivate:[OpticienGuard],
        children:[
          {
            path: 'ajoutPrestOpt',
            component: AjouterPrestationOpticienComponent,
          },
          {
            path: 'ordonnance-non-facturee',
            component: OrdonnanceComponent
        },
        {
            path: 'bordereau-facture',
            component: BordereauFactureComponent
        },
        {
          path: 'historiquePrestationsOpt',
          component: HistoriquePrestationOptComponent
        }
        ],
      },
      {
        path: 'dent',
        canActivate:[DentistGuard],
        children:[
          {
            path: 'ajoutpre',
            component: AjoutPrestationComponent,
          },
          {
            path: 'ordonnance-non-facturee',
            component: OrdonnanceComponent
        },
        {
            path: 'bordereau-facture',
            component: BordereauFactureComponent
        },
        {
          path: 'historiquePrestations',
          component: HistoriquePrestationComponent
        }

        ],
      },
      {
        path: 'optc',
        canActivate:[OpticienControleurGuard],
        children:[
          {
            path: 'prestationCOntreVisite',
            component: ListePrestationControleComponent,
          },

          {
            path: 'prestationNonFactrureOC',
            component: PrestationNonfacturesComponent,
          },

          {
            path: 'bordoreauxFactOC',
            component: BordereauFacturesComponent,
          },
          {
            path: 'ajoutpreC',
            component: AjouterContreVisiteOpticienComponent,
          },

          {
            path: 'ajouterRapport/:id',
            component: AjoutRapportComponent,
          },


        ],
      },
      {
        path: 'dentc',
        canActivate:[DentisteControleurGuard],
        children:[
          {
            path: 'ajoutPrestD',
            component: AjouterContreVisiteDentisteComponent,
          },
          {
            path : "rapport",
            component : CreateComponent
          },
          {
            path: 'rapportCV',
            component: ContreVisiteDentisteComponent
          },
          {
            path: 'prestationNonFactrureOC',
            component: PrestationNonfacturesComponent,
          },

          {
            path: 'bordoreauxFactOC',
            component: BordereauFacturesComponent },

           { path: 'historiqueRapport',
            component: HistoriqueComponent,
          },
        ],
      },


      {
        path: 'profil',
        component: ProfilUserComponent,
      },

      {
        path: 'changer_mot_de_passe',
        component: ChangePasswordComponent,
      },


      {
        path: 'reclamation',
        component: ReclamationComponent,
      },
      {
        path: 'ajouterReclamation',
        component: AjouterReclamationComponent,
      },

      {
        path: 'home',
        component: HomeComponent,
      },





    ],

  },


  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
