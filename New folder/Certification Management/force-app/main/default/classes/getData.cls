public with sharing class getData {
    
    @AuraEnabled(cacheable=true)
    public static list<Employee__c> getEmployeeList(){
        return [SELECT Name,Emp_ID__c,Email__c,Primary_Skill__c,Secondary_Skill__c,Experience__c,Comments__c FROM Employee__c LIMIT 10];
    }

    @AuraEnabled(cacheable=true)
    public static list<Certification__c> getcertData(){
        return [SELECT Cert_Id__c,Name,Comments__c from Certification__c];
    }

    @AuraEnabled(cacheable=true)
    public static list<Voucher__c> getvouData(){
        return [SELECT Voucher_Id__c,Voucher_Cost__c,Certification__c,Validity__c,Active__c,Id,Comments__c from Voucher__c Order by Id ASC NULLS first];
    }

    @AuraEnabled(cacheable=true)
    public static list<Certification_Request__c> getcertReqData(){
        return [SELECT Certification__c,Employee__c,Voucher__c,Name,Id,Due_Date__c,Status__c,Comments__c from Certification_Request__c Order by Id ASC NULLS first];
    }
}
