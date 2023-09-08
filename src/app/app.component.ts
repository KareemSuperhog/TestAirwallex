import { Component, OnInit } from '@angular/core';
import { createElement, ElementType, loadAirwallex } from 'airwallex-payment-elements'

const client_secret = 'replace-with-your-client-secret';
const currency = 'replace-with-your-intent-currency';
const customer_id = 'replace-with-your-customer-id';
const mode = 'recurring';
const next_triggered_by = 'merchant';
const requires_cvc = false;
const card = {
  next_triggered_by,
  requires_cvc,
  currency
};

const recurringOptions = {
  card
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  loading: boolean;
  errorMessage: string;
  domElement?: HTMLElement | null;
  constructor() {
    this.loading = true;
    this.errorMessage = '';
    this.onReady = this.onReady.bind(this);
    this.onSuccess = this.onSuccess.bind(this);
    this.onError = this.onError.bind(this);
    this.domElement = null;
  }

  ngOnInit(): void {
    // STEP #2: Initialize Airwallex on mount with the appropriate production environment and other configurations
    loadAirwallex({
      env: 'demo', // Can choose other production environments, 'staging | 'demo' | 'prod'
      origin: window.location.origin, // Setup your event target to receive the browser events message
      fonts: [
        // Customizes the font for the payment elements
        {
          src: 'https://checkout.airwallex.com/fonts/CircularXXWeb/CircularXXWeb-Regular.woff2',
          family: 'AxLLCircular',
          weight: 400,
        },
      ],
      // For more detailed documentation at https://github.com/airwallex/airwallex-payment-demo/tree/master/docs#loadAirwallex
    }).then(() => {
      // STEP #4: Create the drop-in element
      // STEP #5: Mount the drop-in element to the empty container created previously
        
      this.domElement = createElement('dropIn' as ElementType, {
        // Required, dropIn use intent Id, client_secret and currency to prepare checkout
        client_secret,
        currency,
        customer_id,
        mode,
        recurringOptions
      })?.mount('dropIn');

      this.domElement?.addEventListener('onReady', this.onReady);
      this.domElement?.addEventListener('onSuccess', this.onSuccess);
      this.domElement?.addEventListener('onError', this.onError);
    });
  }

  // STEP #6: Add an event listener to handle events when the element is mounted
  onReady(event: any): void {
    /**
     * ... Handle events on element mount
     */
    this.loading = false;
    console.log(`Element is mounted: ${JSON.stringify(event.detail)}`);
  }

  // STEP #7: Add an event listener to handle events when the payment is successful.
  onSuccess(event: any): void {
    /**
     * ... Handle events on success
     */
    console.log(`Confirm success with ${JSON.stringify(event.detail)}`);
  }

  // STEP #8: Add an event listener to handle events when the payment has failed.
  onError(event: any) {
    /** 
     * ... Handle events on error
     */
    const { error } = event.detail;
    this.errorMessage = error.message ?? JSON.stringify(error); // Example: set error message
    console.error('There was an error', error);
  }

  OnDestroy(): void {
    // Clean up listeners when the component is unmounting
    this.domElement?.removeEventListener('onReady', this.onReady);
    this.domElement?.removeEventListener('onSuccess', this.onSuccess);
    this.domElement?.removeEventListener('onError', this.onError);
  }
}