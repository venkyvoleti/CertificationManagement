import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {  deleteRecord} from 'lightning/uiRecordApi';

import getvouData from '@salesforce/apex/getData.getvouData';
import { refreshApex } from '@salesforce/apex';

import NAME_FIELD from '@salesforce/schema/Voucher__c.Name';
import ID_FIELD from '@salesforce/schema/Voucher__c.Voucher_Id__c';
import COST_FIELD from '@salesforce/schema/Voucher__c.Voucher_Cost__c';
import VALIDITY_FIELD from '@salesforce/schema/Voucher__c.Validity__c';
import CERTIFICATION_FIELD from '@salesforce/schema/Voucher__c.Certification__c';
import ACTIVE_FIELD from '@salesforce/schema/Voucher__c.Active__c';
import COMMENTS_FIELD from '@salesforce/schema/Voucher__c.Comments__c';

const actions = [
    { label: 'Record Details', name: 'record_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    { label: 'Voucher Name', fieldName: 'Name' },
    { label: 'Voucher Id', fieldName: 'Voucher_Id__c',type: 'number' },
    { label: 'Voucher Cost', fieldName: 'Voucher_Cost__c',type: 'number' },
    { label: 'Validity', fieldName: 'Validity__c',type: 'date' },
    { label: 'Certification', fieldName: 'Certification__c',type: 'lookup'},
    { label: 'Active', fieldName: 'Active__c',type:'boolean'},
    { label: 'comments', fieldName: 'Comments__c',type: 'text'},
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions
        }
    }
];



export default class VD extends LightningElement {
    
    

    //inserting data into database

    fields=[NAME_FIELD,ID_FIELD,COST_FIELD,VALIDITY_FIELD,CERTIFICATION_FIELD,ACTIVE_FIELD,COMMENTS_FIELD];

    showNotificationUpdate() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Record Updated',
            variant: 'success',
        });
        this.dispatchEvent(evt);
        location.reload();
    }
    showErrorUpdate() {
        const evt = new ShowToastEvent({
            title: 'Error',
            message: 'Record could not be Updated',
            variant: 'Error',
        });
        this.dispatchEvent(evt);
       
    }

    //inserting data into database Ends

    //fetching the data from Database

    
    @wire(getvouData)
    vouchers;
    @track columns = columns;
    @track vouchers=[];
    @track isEditForm=false;
    
    @track currentRecordId;
    error;

    
    

    handleRowActions(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'record_details':
                alert('Record Details: ' + JSON.stringify(row));
                break;
            case 'edit':
                this.editCurrVou(row);
                break;   
            case 'delete':
                
                this.deleteVou(row);
                break;
 }
}
editCurrVou(currRow) {
    
    this.isEditForm = true;
    this.currentRecordId = currRow.Id;
}

showNotificationUpdate() {
    const evt = new ShowToastEvent({
        title: 'Success',
        message: 'Record Updated',
        variant: 'success',
    });
    this.dispatchEvent(evt);
    location.reload();
}
showErrorUpdate() {
    const evt = new ShowToastEvent({
        title: 'Error',
        message: 'Record could not be Updated',
        variant: 'Error',
    });
    this.dispatchEvent(evt);
   
}


deleteVou(currRow) {
    deleteRecord(currRow.Id).then(() => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Deleted',
            message: 'Record Deleted !',
            variant: 'success'
        }));
        return refreshApex(this.vouchers);
    }).catch(error => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error',
            message: 'Record could not be Deleted !',
            variant: 'error'
        }));
    });
}


}