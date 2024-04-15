import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-menubar',
    standalone: true,
    imports: [CommonModule, ButtonModule, RouterModule],
    templateUrl: './menubar.component.html',
    styleUrl: './menubar.component.css',
})
export class MenubarComponent implements OnInit {

    constructor(private router: Router) { }

    ngOnInit(): void {
        // This code runs after the component's been constructed.
        // The constructor (see above) should only perform lightweight operations.
        // Everything else goes here. Component needs to implement OnInit interface.
        // See https://angular.io/guide/lifecycle-hooks for more info about the component lifecycle
    }

}
