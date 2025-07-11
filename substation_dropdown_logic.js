
const data = {
  "Bidhannagar Region": {
    "Bidhannagar-I Division": ["M-1 Substation", "M-2 Substation", "M-3 Substation", "H- Substation", "B- Substation", "SRC Substation", "A-13 Substation", "Mahisbathan Substation", "M-5 Substation", "ERTL Substation", "Ideal Aqua View"],
    "Bidhannagar-I Switching": ["Stadium Switching Substation", "EE Switching Substation", "G Switching Substation", "A Switching Substation", "C Switching Substation", "D Switching Substation", "I Switching Substation", "J Switching Substation", "K Switching Substation", "Q Switching Substation", "R Switching Substation", "1 Switching Substation", "2 Switching Substation", "3 Switching Substation", "4 Switching Substation", "E Switching Substation", "F Switching Substation"],
    "Bidhannagar-II Division": ["Siddha Happy Villa Substation", "Siddha Payne Substation", "Rajarhat Substation", "AWHO Substation", "Baguihati Substation", "Ghuni Substation", "Mandalganthi Substation", "Vedic Village Substation", "Chandiberia Substation", "NT AA 2E Substation", "One 10 Substation", "Mina Aurumn Substation", "Bisharpara Substation", "Narayanpur Substation", "Bagjola Substaion"],
    "Newtown Division": ["NT AA 1DBPS Substation", "NT AA 2G Substation", "NT AA 3E Substation", "Sukhobristi 1 Substation", "Sukhobristi 2 Substation", "Uni World Substation", "CBD Substation", "NT AA 2B Substation", "Tata Avenida Substation", "DLF Substation", "NT AA 3B Substation", "NT AA 3C Substation", "NT AA 3G Substation", "NT AA 2A Substation", "NT AA 2C Substation", "NT AA 2D Substation", "Eilta Garden Vista Substation", "NT AA 1A Substation", "NT AA 1B Substation", "NT AA 1D Substation", "NT AA 1C Substation", "Silicon Valley Substation", "DSS-16 Substation"],
    "Bhangar Division": ["KLC-2 Substation", "KLC-3 Substation", "Bhangar Substation", "Simoco Substation", "Sarberia Substation", "Jeliakhali Substation", "Chandaneswar Substation", "Minakhan Substation", "SouthCity Substation"]
  },
  "North 24 Parganas Region": {
    "Barrackpur Division": ["Ghola Substation", "Dangapara Substation", "Khardah Substation", "KMDA Substation", "Mohanpur Substation", "Barrackpur Substation", "Mahishpota Substation", "Belgharia Substation", "Old Calcutta Substation", "Sajirhat Substation"],
    "Barasat Division": ["Abdalpur Substation", "Barasat Substation", "Anantapur Substation", "Sisirkunja Substation", "Ganganagar Substation", "Larica Substation", "Bira Substation", "Regent Garment Substation", "Niganj Substation", "Jeerat Substation", "Kishalaya Substation", "Berachampa Subststaion", "Amdanga Substation"],
    "Habra Division": ["KSM Substation", "Gaighata Substation", "Habra Substation", "Mogra Substation", "Banbania Substation", "Banipur Substation", "Gobardanga Substation"],
    "Bongaon Division": ["Meherani Substation", "Helencha Substation", "Nataberia Substation", "Chandpara Substation", "Thakurnagar Substation", "Bongaon Substation"],
    "Bashirhat Division": ["Hasnabad Substation", "Hingalganj Substation", "Nazat Substation", "Basirhat Substation", "Badartala Substation"],
    "Baduria Division": ["Arbelia Substation", "Baduria Substation", "Serapole Substation", "Haroa Substation"],
    "Naihati Division": ["Basudevpur Substation", "Chord Road Substation", "Panpur Substation", "Naihati Jute Mill Substation", "Rishi Bankim Substation", "Gouripur Substation", "Gowalaphatak Substation", "Kanchrapara Substation", "Halisahar Substation"]
  },
  "South 24 Parganas Region": {
    "Garia Division": ["Narendrapur Substation", "Tollyganj Substation", "Southwinds Substation", "Megacity Substation", "Garia Substation", "Nepalganj Substation", "Renia Substation", "Gangajoara Substation", "kalikapur Substation", "Sonarpur Substation"],
    "Baruipur Division": ["Beliachandi Substation", "Tongtola Substation", "Mograhat Substation", "Madarhat Substation", "Baruipur Substation", "Mahinagar Substation"],
    "Joynagar Division": ["Jaynagar Substation", "Uttar Laxminarayanpur Substation", "Mojilpur Substation", "Kultali Substation", "Patharpratima Substation"],
    "Canning Division": ["Uttarbhag Substation", "Jibantala Substation", "Dighirpar Substation", "Gosaba Substation", "Sonakhali Substation"],
    "Behala Division": ["Birlapur Substation", "Deulberia Substation", "Paita Substation", "Amtala Substation", "Khariberia Substation", "Sirakole Substation", "Genex Valley Substation", "DTC Housing Substation"],
    "Behala Switching": ["Switching- A Substation", "Swtching-B Substation", "Switching-C Substation"],
    "Diamond Harbour Division": ["Sarisha Substation", "Falta Sec-2 Substation", "Falta Sec-3 Substation", "Falta Sec-4 Substation", "PDP Substation", "Chandpala Substation", "Deula Substation", "Kulpi Substation", "Simulberia Substation", "Diamond Harbour Substation", "Raichak Substation", "Nischintapur Substation"],
    "Kakdwip Division": ["Kakdwip Substation", "Dakshin Shibganj Substation", "Radhanagar Substation", "Rudranagar Substation", "Namkhana Substation", "Achintyanagar Substation"]
  },
  "Howrah Region": {
    "Howrah-I Division": ["Sankrail Utsab park Substation", "Bally Substation", "Belgachia Substation", "Liluah Substation", "Laxmanpur Substation", "Alampur Substation", "KWIC Substation", "Kona Substation", "Kona TT Substation", "Anmol Hosiery Park Substation", "Rubber Park Substation", "Baltikuri Substation"],
    "Howrah-II Division": ["James Jewellary Substation", "Srijan Logistics Substation", "Jangalpur-I Substation", "Jangalpur-II Substation", "Singti Substation", "Sehaguri Substation", "Amta Substation", "Makardah Substation", "Munshirhat Substation", "Gumadandi Substation", "Domjhur GIS Substation"],
    "Uluberia Division": ["Islampur Substation", "Food Park Substation", "Poly Park Substation", "Banitabla Substation", "Foundry Park Substation", "Shyampur Substation", "Baganda Substation", "Mugkalyan Substation", "Borogram Substation", "Ranihati Substation", "Sankrail Industrial Park Substation", "Ganesh Complex Substation", "UIGC Substation", "Bagnan Substation", "Kalyanpur Substation", "ESR Substation", "EFC Park Substation"]
  }
};

const regionSelect = document.getElementById("region");
const divisionSelect = document.getElementById("division");
const substationSelect = document.getElementById("substation");

Object.keys(data).sort().forEach(region => {
  const option = document.createElement("option");
  option.value = region;
  option.text = region;
  regionSelect.add(option);
});

function updateDivisions() {
  divisionSelect.innerHTML = "";
  substationSelect.innerHTML = "";
  const selectedRegion = regionSelect.value;
  const divisions = Object.keys(data[selectedRegion]).sort();
  divisions.forEach(division => {
    const option = document.createElement("option");
    option.value = division;
    option.text = division;
    divisionSelect.add(option);
  });
  updateSubstations();
}

function updateSubstations() {
  substationSelect.innerHTML = "";
  const selectedRegion = regionSelect.value;
  const selectedDivision = divisionSelect.value;
  const substations = data[selectedRegion][selectedDivision].sort();
  substations.forEach(substation => {
    const option = document.createElement("option");
    option.value = substation;
    option.text = substation;
    substationSelect.add(option);
  });
}

updateDivisions();
