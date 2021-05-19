import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Advice, NoAdvice } from './advice.model';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { animate, style, transition, trigger } from '@angular/animations';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(1000, style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class AppComponent implements OnInit {
  @ViewChild('searchField') searchField: ElementRef;
  advice: Advice;

  isDataAvailable = false;
  isError = false;
  suggestionDone = false;

  words: string[];
  randomIndex: number;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.initWords();
  }

  initWords(): void {
    this.words = ['car', 'rat', 'money', 'women', 'spider'];
    this.randomIndex = Math.floor(Math.random() * this.words.length);
  }

  onSearch(): void {
    this.isError = false;
    const query = this.searchField.nativeElement.value.toLowerCase().trim();
    this.getAdvice(query)
      .pipe(
        catchError((_) => {
          this.isError = true;
          return of(null);
        })
      )
      .subscribe((advice: Advice) => {
        if (this.isError) {
          return;
        }

        this.isDataAvailable = true;
        if (!advice.hasOwnProperty('slips')) {
          return (this.advice = null);
        }

        this.advice = advice;
      });
  }

  onFeelingLuckyClick() {
    if (this.words.length !== 0) {
      this.searchField.nativeElement.value = this.words[this.randomIndex];
      this.words.splice(this.randomIndex, 1);

      const index = Math.floor(Math.random() * (this.words.length - 1));
      this.randomIndex = index;
    } else {
      this.suggestionDone = true;
    }
  }

  onResetClick(): void {
    this.searchField.nativeElement.value = '';
    this.suggestionDone = false;
    this.isDataAvailable = false;
    this.initWords();
  }

  getAdvice(query: string): Observable<any> {
    return this.http.get(`https://api.adviceslip.com/advice/search/${query}`);
  }
}
