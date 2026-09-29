import { Component } from '@angular/core';
import { AuthServiceService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { TheameService } from '../../core/services/theame.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
userName = '';

  constructor(
    private auth: AuthServiceService,
    private router: Router,
    public themeService: TheameService
  ) {
    const user = this.auth.getUser();

    if (user) {
      this.userName = user.userName;
    }
  }

   toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  logout(): void {

    this.auth.logout();

    this.router.navigate(['/login']);

  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }

}
