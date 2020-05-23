import { LightningElement, track, wire } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import {  deleteRecord } from 'lightning/uiRecordApi';
 
import getcertReqData from '@salesforce/apex/getData.getcertReqData';
import { refreshApex } from '@salesforce/apex';
import CERTREQ_Object from '@salesforce/schema/Certification_Request__c';
import NAME_FIELD from '@salesforce/schema/Certification_Request__c.Name';
import STATUS_FIELD from '@salesforce/schema/Certification_Request__c.Status__c';
import DUE_DATE_FIELD from '@salesforce/schema/Certification_Request__c.Due_Date__c';
import EMPLOYEE_FIELD from '@salesforce/schema/Certification_Request__c.Employee__c';
import CERTIFICATION_FIELD from '@salesforce/schema/Certification_Request__c.Certification__c';
import VOUCHER_FIELD from '@salesforce/schema/Certification_Request__c.Voucher__c'
import EMAIL_FIELD from '@salesforce/schema/Certification_Request__c.Employee_Email__c';
import COMMENTS_FIELD from '@salesforce/schema/Certification_Request__c.Comments__c';
 
const actions = [
    { label: 'Record Details', name: 'record_details' },
    { label: 'Edit', name: 'edit' },
    { label: 'Delete', name: 'delete' }
];

const columns = [
    { label: 'Request Id', fieldName: 'Name' },
    { label: 'Certification Name', fieldName: 'Certification__c' },
    { label: 'Employee Name', fieldName: 'Employee__c' },
    { label: 'Due Date', fieldName: 'Due_Date__c' },
    { label: 'Status', fieldName: 'Status__c' },
    { label: 'Voucher Name', fieldName: 'Voucher__c',type:'lookup' },
    { label: 'Request Comments', fieldName: 'Comments__c' },
    { label: 'Employee Email', fieldName: 'Employee_Email__c',type:'email' },
    {
        type: 'action',
        typeAttributes: {
            rowActions: actions,
        }
    }
];
 
export default class CR extends LightningElement {

    //inserting records into Database

    fields=[NAME_FIELD,STATUS_FIELD,DUE_DATE_FIELD,EMPLOYEE_FIELD,CERTIFICATION_FIELD,VOUCHER_FIELD,EMAIL_FIELD,COMMENTS_FIELD];
   
    showNotification() {
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Record Created',
            variant: 'success',
        });
        this.dispatchEvent(evt);
        location.reload();
    }
    showError() {
        const evt = new ShowToastEvent({
            title: 'Error',
            message: 'Record could not be created',
            variant: 'Error',
        });
        this.dispatchEvent(evt);
       
    }
    

    //fetching the data from Database

    
    
    
   

    @wire(getcertReqData)
    certReqs;
    @track columns = columns;
    @track certReqs=[];
    @track isEditForm=false;

    @track error;
    

    handleRowActions(event) {
        const action = event.detail.action;
        const row = event.detail.row;
        switch (action.name) {
            case 'record_details':
                alert('Record Details: ' + JSON.stringify(row));
                break;
            case 'edit':
                this.editCurrCr(row);
                break;   
            case 'delete':
                
                this.deleteCr(row);
                break;
 }
}
editCurrCr(currRow) {
    
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

deleteCr(currRow) {
    deleteRecord(currRow.Id).then(() => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Deleted',
            message: 'Record Deleted !',
            variant: 'success'
        }));
        return refreshApex(this.certReqs);
    }).catch(error => {
        this.dispatchEvent(new ShowToastEvent({
            title: 'Error',
            message: 'Record could not be Deleted !',
            variant: 'error'
        }));
    });
}
}
