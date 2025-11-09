import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from "primeng/button";
import { Slider } from 'primeng/slider';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-candidate',
  imports: [CommonModule, TableModule, Slider, FormsModule, TagModule, IconFieldModule, InputTextModule, InputIconModule, MultiSelectModule, SelectModule, HttpClientModule, CommonModule, ButtonModule],
  templateUrl: './candidate.html',
  styleUrl: './candidate.css',
})
export class Candidate implements OnInit {

    products!: any[];
    value: number = 10;

    constructor(
        private router: Router

    ) {

    }


    ngOnInit() {
        this.products = [
            { 'code': 'teataeteat', 'name': 'Sriay Tuladhar', 'years': 4, 'price': 29292.00, 'category': 'Tech', 'quantity': 25}, 
            { 'code': 'asjdhaskjk', 'name': 'Mr. Khan', 'years': 2, 'price': 2323.00, 'category': 'Business', 'quantity': 30}, 
            { 'code': '23123lkhnl', 'name': 'Tom Cruise', 'years': 3, 'price': 2222.00, 'category': 'Marketing', 'quantity': 19}, 
            { 'code': 'asndaskjjs', 'name': 'Vanilla Ice', 'years': 9, 'price': 2311.00, 'category': 'Finance', 'quantity': 27}, 
            { 'code': 'o1iu3l23kk', 'name': 'Sanjay Dutt', 'years': 10, 'price': 123123.00, 'category': 'HR', 'quantity': 22}, 
        ]        

    }


   navigateTo(path: string) {
    this.router.navigate([path]);
  }

    
}
