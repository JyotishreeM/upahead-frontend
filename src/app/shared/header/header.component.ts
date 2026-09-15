import { Component } from '@angular/core';
import { AuthServiceService } from '../../core/services/auth.service';
import { Router, RouterLink } from '@angular/router';

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
    private router: Router
  ) {
    const user = this.auth.getUser();

    if (user) {
      this.userName = user.userName;
    }
  }

  logout(): void {

    this.auth.logout();

    this.router.navigate(['/login']);

  }

  goToProfile(){
    this.router.navigate(['/profile']);
  }

}
