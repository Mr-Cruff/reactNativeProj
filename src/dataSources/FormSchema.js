//Mock Form MetaData
const formFields = [
    {
      title: 'Culls & Mortality',
      type: 'common',
      fields: [
          {label: 'Culls - Male', type: 'int', regex:{min:0, max:null,isRequired:true}, farmType:'common'},
          {label: 'Mortality - Male', type: 'int', regex:{min:0, max:null,isRequired:true}, farmType:'common'},
          {label: 'Dead on Arrival - Male', type: 'int', regex:{min:0, max:100,isRequired:false}, farmType:'grow'},
          {label: 'Culls - Female', type: 'int', regex:{min:0, max:null,isRequired:true}, farmType:'common'},
          {label: 'Mortality - Female', type: 'int', regex:{min:0, max:null,isRequired:true}, farmType:'common'},
          {label: 'Dead on Arrival - Female', type: 'int', regex:{min:0, max:100,isRequired:false}, farmType:'grow'},
      ],
    },
    {
      title: 'Feed Inventory',
      type: 'common',
      fields: [
          //Feed Inventory
          {label: 'Feed Brought Forward (lbs)', type: 'float', regex:{min:0, max:60000,isRequired:true}, farmType:'common'},
          // {label: 'Feed Recieved (lbs)', type: 'float', regex:{min:0, max:null,isRequired:true}, farmType:'common'},
          {label: 'Feed Transferred (lbs)', type: 'float', regex:{min:0, max:50000,isRequired:false}, farmType:'common'},
          {label: 'Feed Spoilage (lbs)', type: 'float', regex:{min:0, max:50000,isRequired:false}, farmType:'common'},
          // {label: 'Days in Inventory', type: 'float', regex:{min:0, max:null,isRequired:false}, farmType:'common'},
          //Feed Consumed
          {label: 'Feed Start Time', type: 'time', regex:{isRequired:true}, farmType:'common'},
          {label: 'Feed Consumption Time', type: 'justTime', regex:{isRequired:true},farmType:'common'},
          {label: 'Feed Consumed (lbs) - Male', type: 'float', regex:{min:0, max:600,isRequired:true},farmType:'common'}, //Conditional fields based on gender
          {label: 'Feed Consumed (lbs) - Female', type: 'float', regex:{min:0, max:3000,isRequired:true},farmType:'common'}, //Conditional fields based on gender
          {label: 'Feed Distribution - Male', type: 'option', options: ['GOOD','POOR'], regex:{min:0, max:null,isRequired:true},farmType:'common'},
          {label: 'Feed Distribution - Female', type: 'option', options: ['GOOD','POOR'], regex:{min:0, max:null,isRequired:true},farmType:'common'},
      ],
    },
    {
      title: 'Miscellaneous',
      type: 'common',
      fields: [
        {label: 'Water Consumption (gal)', type: 'float', regex:{min:0.001, max:null, isRequired:true}, farmType:'common'},
        {label: 'All Clocks on Time', type: 'option', options: ['YES','NO'], regex:{isRequired:true}, farmType:'common'},
        {label: 'Lights', type: 'multi-time-only', farmType:'common', regex:{isRequired:true}, 
        fields: [{label: 'ON Time', type: 'time', regex:{isRequired:true, label:"LIGHT ON"}, farmType:'common'}, {label: 'OFF Time', type: 'time', regex:{isRequired:true, label:"LIGHT OFF"}, farmType:'common'}]},
        {label: 'Lighting Hours', type: 'float', regex:{min:0, max:24, isRequired:true}, farmType:'common'}, // OFF time - On time
        // {label: 'Morning Temperature', type: 'time', type: 'float', view:'value-time', regex:{isRequired:true}, farmType:'common'},
        // {label: 'Afternoon Temperature', type: 'time', view:'value-time', regex:{isRequired:true}, farmType:'common'},
        {
          label: 'Temperature',
          type: 'time',
          farmType:'common',
          fields: [
            {label: 'Morning Entry', type: 'float', view:'value-time', regex:{isRequired:true}},
            {label: 'Afternoon Entry', type: 'float', view:'value-time', regex:{isRequired:true}},
          ]
        },
        {label: 'Observation/Comments', type: 'description', regex:{isRequired:false}, farmType:'common'},
      ],
    },
    {
      title: 'Birds',
      type: 'common',
      fields: [
        {label: 'Bird Weight (grams) - Male', type: 'float', regex:{min:0, max:6000, isRequired:false}, farmType:'common'},
        {label: 'Bird Weight (grams) - Female', type: 'float', regex:{min:0, max:6000, isRequired:false}, farmType:'common'},
        {label: 'Uniformity (%) - Male', type: 'int', regex:{min:0, max:100, isRequired:false}, farmType:'common'},
        {label: 'Uniformity (%) - Female', type: 'int', regex:{min:0, max:100, isRequired:false}, farmType:'common'},
        {label: 'Birds Added - Male', type: 'int', regex:{min:0, max:null, isRequired:false}, farmType:'common'},
        {label: 'Birds Added - Female', type: 'int', regex:{min:0, max:null, isRequired:false}, farmType:'common'},
        {label: 'Number of Birds Weighed - Male', type: 'int', regex:{min:0, max:null, isRequired:false}, farmType:'common'},
        {label: 'Number of Birds Weighed - Female', type: 'int', regex:{min:0, max:null, isRequired:false}, farmType:'common'},
      ],
    },
    {
        title: 'Eggs',
        type: 'production',
        fields: [
            {
              label: 'Hatching Eggs', 
              type: 'multi-field', 
              fields: [
                {label: 'Hatching 1st Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Hatching 2nd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Hatching 3rd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Hatching 4th Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              ],
            },
            {
              label: 'Reject Eggs', 
              type: 'multi-field', 
              fields: [
                {label: 'Rejects 1st Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Rejects 2nd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Rejects 3rd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Rejects 4th Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              ],
            },
            {
              label: 'Dumps', 
              type: 'multi-field', 
              fields: [
                {label: 'Dumps 1st Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Dumps 2nd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Dumps 3rd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Dumps 4th Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              ],
            },
            {
              label: 'Double Yolked Eggs', 
              type: 'multi-field', 
              fields: [
                {label: 'Double Yolked 1st Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Double Yolked 2nd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Double Yolked 3rd Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
                {label: 'Double Yolked 4th Entry', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
              ],
            },
            // {label: 'Eggs Delivered', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
            {label: 'Gross Egg Weight (grams)', type: 'float', regex:{min:0.001, max:null, isRequired:true},farmType:'production'},
            {label: 'Average Egg Weight (grams)', type: 'float', regex:{min:0.001, max:null, isRequired:true},farmType:'production'},
            {label: 'Number of Eggs Weighed', type: 'int', regex:{min:0, max:null, isRequired:true},farmType:'production'},
            {
              label: 'Egg Room Temperature',
              type: 'time',
              farmType:'common',
              fields: [
                {label: 'Egg Room 1st Entry', type: 'float', view:'value-time', regex:{isRequired:true},farmType:'production'},
                {label: 'Egg Room 2nd Entry', type: 'float', view:'value-time', regex:{isRequired:true},farmType:'production'},
              ]
            },
            // {
            //   label: 'Egg Room Temp (Dry)',
            //   type: 'time',
            //   fields: [
            //     {label: 'Egg Dry 1st Entry', type: 'float', view:'value-time'},//Egg Room Temp - Entry 1 & 2
            //     {label: 'Egg Dry 2nd Entry', type: 'float', view:'value-time'}
            //   ]
            // },
            {label: 'Egg Room Humidity (%)', type: 'float', regex:{min:0, max:100, isRequired:true},farmType:'production'},
        ],
    },
    {
        title: 'Vaccination',
        type: 'grow',
        fields: [
          {label: 'Type/Description', type: 'string', regex:{isRequired:false,max:19},farmType:'grow'},
          {label: 'Quantity', type: 'float', regex:{min:0, max:10000000000,isRequired:false},farmType:'grow'},
          {label: 'Serial Number', type: 'string', regex:{isRequired:false, max:19},farmType:'grow'},
        ],
    },
];
  
export default formFields;