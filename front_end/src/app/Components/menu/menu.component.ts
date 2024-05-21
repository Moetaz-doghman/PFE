import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/Services/auth-service.service';
import { StorageServiceService } from 'src/app/Services/storage-service.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {


  private roles: string[] = [];
  isLoggedIn = false;
  showAdminBoard = false;
  showOpticienBoard = false;
  showDentistBoard = false;
  showOpticienControleurBoard = false;
  showDentistControleurBoard = false;
   users  = this.storageService.getUser();
   isSidebarExpanded = false;

  username?: string;

  constructor(private storageService: StorageServiceService, private authService: AuthServiceService, private router: Router) {}

  ngOnInit(): void {
    const hamBurger = document.querySelector(".toggle-btn");

    if (hamBurger) {
      hamBurger.addEventListener("click", () => {
        document.querySelector("#sidebar").classList.toggle("expand");

      });
    }

    this.isLoggedIn = this.storageService.isLoggedIn();

    if (this.isLoggedIn) {
      const user = this.storageService.getUser();
      this.roles = user.roles;


      this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
      this.showOpticienBoard = this.roles.includes('ROLE_OPTICIEN');
      this.showDentistBoard = this.roles.includes('ROLE_DENTIST');
      this.showOpticienControleurBoard = this.roles.includes('ROLE_OPTICIEN_CONTROLEUR');
      this.showDentistControleurBoard = this.roles.includes('ROLE_DENTIST_CONTROLEUR');

      this.username = user.nom;
      this.updateMenuData(); // Mettre à jour les données du menu après une connexion réussie
    }
  }

  logout(): void {
    
    this.storageService.clean();
    this.router.navigate(['/login']);

  }

  toggleSidebar(): void {
    this.isSidebarExpanded = !this.isSidebarExpanded;

  }

  updateMenuData(): void {
    const user = this.storageService.getUser();
    this.roles = user.roles;

    this.showAdminBoard = this.roles.includes('ROLE_ADMIN');
    this.showOpticienBoard = this.roles.includes('ROLE_OPTICIEN');
    this.showDentistBoard = this.roles.includes('ROLE_DENTIST');
    this.showOpticienControleurBoard = this.roles.includes('ROLE_OPTICIEN_CONTROLEUR');
    this.showDentistControleurBoard = this.roles.includes('ROLE_DENTIST_CONTROLEUR');

    this.username = user.nom;
  }


}
