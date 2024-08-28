//Todo: API Queries
//GetFormTypes() - returns a list of all available forms
//GetFormDetails(FormID) - returns form fields
//GetAllSubmittedForms(userId) - returns All forms Submitted bgy user
//GetSubmittedForm(FormID) - returns Submitted Form
//Explore a weather tracking solution for the dashboard

//GetSubmittedForms
export const submittedForms = [
  {
    formName: 'Daily Grow',
    dateSubmitted: '',
    FarmType: 'Grow Farm',
    FarmId: 'farm5',
    FarmName: 'Farm 5',
    house: 'House 1',
  },
  {
    formName: 'Egg Collection',
    dateSubmitted: '',
    FarmType: 'Production Farm',
    FarmId: 'farm7',
    FarmName: 'Farm 7',
    house: '2',
  },
  {
    formName: 'Daily Production',
    dateSubmitted: '',
    FarmType: 'Production Farm',
    FarmId: 'farm7',
    FarmName: 'Farm 7',
    house: '2',
  },
];

export const profile = [
  {
    name: '',
    userId: '',
    farms: [
      {
        name: 'farm3',
        farmId: '003',
        farmType: 'Grow Farm',
      },
      {
        name: 'farm7',
        farmId: '007',
        farmType: 'Production Farm',
      },
    ],
  },
];
