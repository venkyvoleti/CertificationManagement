trigger EmployeeDuplicate on Certification_Request__c ( before insert ) {
    if ( Trigger.isInsert ) {
        for ( Certification_Request__c obj : Trigger.new ) {
            List<Certification_Request__c> ob = [SELECT Employee__c FROM Certification_Request__c WHERE Employee__c=:obj.Employee__c];
            if ( ob.size() > 0 ) {
                obj.Employee__c.addError(' Certification Request for this Employee already exists !');
            } else { break; }
        }
    }
}