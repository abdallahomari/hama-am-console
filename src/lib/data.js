/* =========================================================
   DATA — fields taken from the Deals and Repair_BOM forms
   in the HAMA app export. Demo values, invented customers.
   ========================================================= */
export const ST = {
  none:     {pill:'BOM NOT CREATED',       cls:'p-gry', act:'Create BOM', pri:true,  need:true,  order:0},
  returned: {pill:'RETURNED FOR REVISION', cls:'p-red', act:'Update BOM', pri:true,  need:true,  order:1},
  pending:  {pill:'APPROVAL IN PROGRESS',  cls:'p-blu', act:'View BOM',   pri:false, need:false, order:2},
  approved: {pill:'APPROVED',              cls:'p-grn', act:'View BOM',   pri:false, need:false, order:3}
};

export const DEALS=[
 {id:'DEAL-20', cust:'Al-Kharj Water Company',
  problem:'Four generator sets showing low compression and excessive blow-by after 14,000 running hours. Two units will not hold load above 60 percent.',
  remarks:'Customer requests all four units be returned together. Site has no standby capacity during the overhaul.',
  scope:'Full top-end overhaul on all four engines, including head reconditioning, injector service and cooling system flush. Turbochargers to be assessed and reported before any replacement.',
  feas:'Feasible', turn:34, review:'Compression readings confirm ring and liner wear on all four. Heads require skimming. No block damage found.',
  status:'Open', won:'', planBom:true, bomAppr:false, availStatus:'Not Set', availFrom:'', availTo:'', po:'',
  parts:28360.50, labour:9600.00, vendor:3150.00, hours:128.0, docs:6,
  engines:[
   {id:'ENG-52', tag:'AKW-DZ-011', model:'Deutz TCD2013',   st:'returned', bom:'BOM-74', val:9120.50,
    note:'Water pump priced at list — use the contract price from the last purchase order'},
   {id:'ENG-53', tag:'AKW-DZ-012', model:'Deutz TCD2013',   st:'pending',  bom:'BOM-75', val:8940.00, note:'Submitted 2 days ago'},
   {id:'ENG-54', tag:'AKW-PK-005', model:'Perkins 1106A-70',st:'none'},
   {id:'ENG-55', tag:'AKW-PK-006', model:'Perkins 1106A-70',st:'approved', bom:'BOM-66', val:10300.00, note:'Approved 6 days ago'}
  ]},

 {id:'DEAL-21', cust:'Jubail Petrochemical Services',
  problem:'Eight standby units due for scheduled remanufacture. Three reported overheating under sustained load.',
  remarks:'Phased return requested — four units at a time.',
  scope:'Complete remanufacture to OEM specification. Chemical wash on all components. Testing certificates required for each unit.',
  feas:'Feasible', turn:45, review:'Three units need liner replacement. Remaining five are within tolerance for a standard rebuild.',
  status:'Open', won:'', planBom:true, bomAppr:false, availStatus:'Not Set', availFrom:'', availTo:'', po:'',
  parts:96386.85, labour:31200.00, vendor:8400.00, hours:416.0, docs:11,
  engines:[
   {id:'ENG-58', tag:'JPS-DZ-011', model:'Deutz BF6M1013',  st:'none'},
   {id:'ENG-59', tag:'JPS-DZ-012', model:'Deutz BF6M1013',  st:'pending',  bom:'BOM-84', val:8410.00,  note:'Submitted 3 days ago'},
   {id:'ENG-60', tag:'JPS-DZ-013', model:'Deutz BF6M1013',  st:'pending',  bom:'BOM-85', val:19240.75, note:'Submitted 4 days ago'},
   {id:'ENG-61', tag:'JPS-PK-004', model:'Perkins 1106A-70',st:'returned', bom:'BOM-76', val:13410.00,
    note:'Turbocharger cartridge not required — remove the line and resubmit'},
   {id:'ENG-62', tag:'JPS-PK-005', model:'Perkins 1106A-70',st:'pending',  bom:'BOM-86', val:11240.00, note:'Submitted 2 days ago'},
   {id:'ENG-63', tag:'JPS-DZ-014', model:'Deutz TCD2013',   st:'approved', bom:'BOM-70', val:12905.60, note:'Approved 3 days ago'}
  ]},

 {id:'DEAL-23', cust:'Red Sea Marine Works',
  problem:'Two marine auxiliary units with salt water ingress to the cooling circuit.',
  remarks:'Vessel alongside until 12 November. Hard deadline.',
  scope:'Strip, inspect and report before any parts are committed. Corrosion assessment on all water-side components.',
  feas:'Under Review', turn:0, review:'',
  status:'Open', won:'', planBom:false, bomAppr:false, availStatus:'Not Set', availFrom:'', availTo:'', po:'',
  parts:0, labour:0, vendor:0, hours:0, docs:3,
  engines:[
   {id:'ENG-66', tag:'RSM-DZ-007', model:'Deutz BF4M2012', st:'none'},
   {id:'ENG-67', tag:'RSM-DZ-008', model:'Deutz BF4M2012', st:'none'}
  ]},

 {id:'DEAL-18', cust:'Eastern Cement Industries',
  problem:'Three kiln drive units, one seized following a lubrication failure.',
  remarks:'Seized unit may be beyond economical repair — report required before proceeding.',
  scope:'Two units to full overhaul. Third to be assessed and quoted separately.',
  feas:'Feasible', turn:28, review:'Seized unit has crankshaft damage but the block is serviceable.',
  status:'Open', won:'', planBom:true, bomAppr:false, availStatus:'Not Set', availFrom:'', availTo:'', po:'',
  parts:33585.25, labour:11400.00, vendor:5600.00, hours:152.0, docs:8,
  engines:[
   {id:'ENG-49', tag:'ECI-DZ-002', model:'Deutz BF4M2012',  st:'returned', bom:'BOM-71', val:14280.00,
    note:'Turbocharger cartridge not required — the unit was replaced under warranty last year'},
   {id:'ENG-50', tag:'ECI-PK-003', model:'Perkins 1104C-44',st:'pending',  bom:'BOM-79', val:11875.25, note:'Submitted 1 day ago'},
   {id:'ENG-51', tag:'ECI-PK-004', model:'Perkins 1104C-44',st:'approved', bom:'BOM-68', val:7430.00,  note:'Approved 5 days ago'}
  ]},

 {id:'DEAL-16', cust:'Jazan Industrial Gases',
  problem:'Two compressor drive units due for scheduled overhaul.',
  remarks:'Routine. No urgency.',
  scope:'Standard remanufacture to OEM specification.',
  feas:'Feasible', turn:30, review:'Both units in good condition. Straightforward rebuild.',
  status:'Open', won:'', planBom:true, bomAppr:false, availStatus:'Not Set', availFrom:'', availTo:'', po:'',
  parts:29200.75, labour:9800.00, vendor:2100.00, hours:120.0, docs:4,
  engines:[
   {id:'ENG-46', tag:'JIG-DZ-004', model:'Deutz BF6M1013', st:'pending', bom:'BOM-82', val:15220.75, note:'Submitted 4 hours ago'},
   {id:'ENG-47', tag:'JIG-DZ-005', model:'Deutz BF6M1013', st:'pending', bom:'BOM-83', val:13980.00, note:'Submitted 2 hours ago'}
  ]}
];

/* =========================================================
   BOM LINES — generated and cached
   ========================================================= */
export const PARTS=['Cylinder head gasket set','Main bearing set STD','Connecting rod bush','Piston ring set',
'Cylinder liner kit','Valve guide set','Valve seat insert','Inlet valve','Exhaust valve','Valve spring',
'Rocker arm assembly','Push rod','Camshaft bush','Crankshaft oil seal front','Crankshaft oil seal rear',
'Timing gear','Oil pump assembly','Oil cooler element','Oil filter element','Fuel filter element',
'Water pump assembly','Water pump housing seal','Thermostat 82°C','Radiator hose upper','Radiator hose lower',
'Turbocharger cartridge','Turbo gasket kit','Injector nozzle','Injection pump seal kit','Fuel lift pump',
'Air filter element','Intake manifold gasket','Exhaust manifold gasket','Exhaust manifold stud',
'Starter motor brush set','Alternator bearing kit','Flywheel ring gear','Engine mounting rubber',
'Sump gasket','Front cover gasket','Big end bearing set','Thrust washer set','Tappet','Glow plug',
'Cylinder head bolt set','Dipstick tube seal','Breather element','Coolant temperature sensor'];

export const NOTES=['Replace — scoring beyond limit','Customer requested OEM part','Reuse if within tolerance',
'Supersedes previous part number','Machining required before fitting','Supplied as a kit','Fit new on reassembly'];
