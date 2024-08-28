export const APP_ID = 'BB691C6B-6357-4101-AE67-08DA96D9ABF9';

// =============================== **** PRODUCTION ***** =====================================================
// export const AUTH_API ='https://jbgauthservices.jabgl.com';
// export const APP_API ='https://ipbformdata.jabgl.com';
// ===========================================================================================================

// =============================== **** DEV/UAT ***** =====================================================
export const AUTH_API = 'https://devjbgauthservices.jabgl.com:6006';
export const APP_API = 'https://devipbformdata.jabgl.com:84';
// ===========================================================================================================

export enum APP_ROLES {
  'System Administrator',
  'Approver',
  'Application Administrator',
  'Data Collection Officer',
  'Data Supervisor',
}

export enum FORM_STATUS_OBJ {
  'Incomplete' = -1,
  'Presubmitted',
  'Submitted',
  'Approved',
  'Rejected',
  'Approved and Delivered',
  'Completed with Errors',
  'Interface Failed',
}

export const WEEKDAY = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const MONTH = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const ENDPOINTS = {
  ResetPassword: `/api/Auth/ChangePassword?UserId=`,
  GetFarmsByUserId: `/api/Farm/getFarmByOwner?id=`,
  FormSubmit: `/api/FormDetails/submitFormDetails`,
  FormResubmit: `/api/FormDetails/re-submitFormDetails`,
  GetEggs: `/api/EggCollection/getEggTotals`,
  EggDelivery: `/api/EggDelivered/submitEggDeliveryDetails`,
  GetFormByFormId: `/api/FormDetails/GetSubmittedFormByFormID`,
  GetSubmittedFormDetailsByFarmId: `/api/FormDetails/getformdetailsSubmittedByFarm`,
  FormApproval: `/api/FormDetails/formID?formId=`,
};
