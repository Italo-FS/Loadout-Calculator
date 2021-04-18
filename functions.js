//alert("I am an alert box!");
//function that display value
var inventory = []

function calcular()
{
	var peso = 0;
	for (var i = 0; i < inventory.length; i++) {
		if (inventory[i] != null) {
			peso += (bd[inventory[i][0]].Encumbrance * inventory[i][1]);
		}
	}
	document.getElementById("Peso").value = peso + '%';
}

function add(val, qtde = 1, split = false)
{				
	if (bd[val].Slot == 8) {
		inventory[8] = [];
		inventory[8][0] = val;
		inventory[8][1] = 1;
		atualizarSlot(8)
		return true;
	}
	if (bd[val].Stackable && !split) {
		for (var i = 101; i <= 110; i++) {						
			if (inventory[i] != null) {							
				if (inventory[i][0] == val && inventory[i][1]<99) {								
					inventory[i][1] += qtde;
					atualizarSlot(i);								
					calcular();					
					return true;
				}
			}
		}
	}				
	for (var j = 101; j <= 109; j++) {
		if (inventory[j] == null) {
			inventory[j] = [];
			inventory[j][0] = val;
			inventory[j][1] = qtde;
			atualizarSlot(j);
			calcular();
			return true;
		}
	}
	return false
}

function interarirInventario(event, id)
{
	if (event.altKey) {					
		dropItem(id);
	}
	else if (event.ctrlKey) {
		dividir(id);
	}
	else {					
		if (id < 100) {
			desequipar(id);
		}
		else {
			equipar(id);
		}
	}
	calcular();
}

function interarirStockpile(event, id) 
{
	if (event.shiftKey) {
		for (i=0; i<3; i++) {
			add(id);
		}
	}
	else {
		add(id);
	}
}

function dividir(id) 
{
	if (id > 100) {
		var up = Math.ceil(inventory[id][1]/2);
		var down = inventory[id][1] - up;
		if (add(inventory[id][0], down, true) == true) {
			inventory[id][1] = up;
			atualizarSlot(id);
		}
	}
}

function dropItem(id) 
{				
	inventory[id] = null;
	atualizarSlot(id);	
}

function equipar(id)
{
	if (inventory[id] == null) {
		return;
	}
	slot = bd[inventory[id][0]].Slot;
	if (slot > 0) {					
		if (inventory[slot] == null) {
			inventory[slot] = [];
		}

		if (inventory[slot][0] == inventory[id][0] && bd[inventory[id][0]].Stackable) {
			inventory[slot][1] = inventory[slot][1] + inventory[id][1];
			dropItem(id);
		}
		else {
			var backup = [];
			backup[0] = inventory[slot][0];
			backup[1] = inventory[slot][1];

			inventory[slot][0] = inventory[id][0];
			inventory[slot][1] = inventory[id][1];						

			if (backup[0] != null) {
				inventory[id][0] = backup[0];
				inventory[id][1] = backup[1];
				atualizarSlot(id);
			}
			else {
				dropItem(id);
			}
		}
		atualizarSlot(slot);
	}
}

function atualizarSlot(id)
{
	var valor;
	remover_tolltip(id);
	
	if (inventory[id]== null) {
		//document.getElementById("C"+id).src = "https://imgur.com/TmwmszG.png";
		atualizarImagem(id, "https://imgur.com/TmwmszG.png");
		valor = '';		
	}
	else {					
		//document.getElementById("C"+id).src = bd[inventory[id][0]].Icon;
		atualizarImagem(id, bd[inventory[id][0]].Icon);
		valor = inventory[id][1];
	}
	
	atualizarValor(id, valor);
	create_tooltips(id);
}

function atualizarImagem(id, imagem, letter = 'C') {	
	var doc = document.getElementById(letter+id);
	for (var i = 0; i < doc.childNodes.length; i++) {
		if (doc.childNodes[i].className == "imagem") {
		  doc.childNodes[i].src = imagem
		  break;
		}
	}
}

function atualizarValor(id, valor) {
	var doc = document.getElementById("C"+id);
	if (valor < 2) {
		valor = '';
	}
	for (var i = 0; i < doc.childNodes.length; i++) {
		if (doc.childNodes[i].className == "numero") {
		  doc.childNodes[i].innerHTML = valor
		  break;
		}
	}
}

function desequipar(id)
{
	if (bd[inventory[id][0]].Stackable || add(inventory[id][0], inventory[id][1]) == true) {
		dropItem(id)
	}
}

function start() {
	generate_stockpile();
	updateStockpile();
	generate_tooltips();
}

function updateStockpile()
{
	bdLen = bd.length;
	for (var i = 0; i < bdLen; i++) {
		//document.getElementById("S"+i).src = bd[i].Icon
		atualizarImagem(i, bd[i].Icon, 'S');
	}
}

function generate_stockpile()
{
	var tbl = document.getElementById("stockpile");
	var tblBody = document.createElement("tbody");

	var aux = 0;
	var maxAux = bd.length;

	// creating all cells
	for (var i = 0; i < bd.length/10; i++) {
	// creates a table row
		var row = document.createElement("tr");

		for (var j = 0; j<10 && aux<maxAux; j++) {               
			// Create a <td> element and a text node, make the text
			// node the contents of the <td>, and put the <td> at
			// the end of the table row
			var id = (i*10)+j;

			var cell = document.createElement("td");

			var ctn = document.createElement("div");
			ctn.setAttribute("class", "container");
			ctn.setAttribute("id", "S"+id);
			ctn.setAttribute("onclick", "interarirStockpile(event, "+id+")");			

			var png = document.createElement("img");
			png.setAttribute("class", "imagem");					
			
			row.appendChild(cell);
			cell.appendChild(ctn);
			ctn.appendChild(png);			

			aux++;
		}

		// add the row to the end of the table body
		tblBody.appendChild(row);
	}

	// put the <tbody> in the <table>
	tbl.appendChild(tblBody);
}

function remover_tolltip(id) {	
	var doc = document.getElementById("C"+id);
	for (var i = 0; i < doc.childNodes.length; i++) {
		if (doc.childNodes[i].className == "tooltiptext") {
			doc.childNodes[i].remove();
		}
	}
}

function generate_tooltips() {
	var ctn = document.getElementsByClassName('container');
	for (var i = 0; i < ctn.length; i++) {
		var letter = ctn[i].getAttribute("id").substring(0,1);
		var n = ctn[i].getAttribute("id").substring(1);
		
		
		create_tooltips(n, letter);
	}
}

function create_tooltips(n, letter = 'C') {
	if (letter == 'C') {
		if (inventory[n] != null) {
			id = inventory[n][0];
		}
		else {
			return;
		}
	}
	else {
		id = n;
	}
	
	var ctn = document.getElementById(letter+n);
		
	var spn = document.createElement("span");
	spn.setAttribute("class", "tooltiptext");		
	ctn.appendChild(spn);
	
	var divA = document.createElement("div");
	divA.setAttribute("style", "border-bottom: 2px outset white;min-height: 35px;height: max-content;height: 100%; display: flex; align-items: center;");
	spn.appendChild(divA);
	
	var divB = document.createElement("div");
	divB.setAttribute("style", "font-size: 80%; text-align: center;border-bottom: 2px outset white;");
	spn.appendChild(divB);		
	
	var divC = document.createElement("div");
	divC.setAttribute("style", "font-size: 80%; text-align: center;");
	spn.appendChild(divC);
	
	// ------------------------------------------
	
	var pName = document.createElement("p");
	pName.innerHTML  = bd[id].Name;
	pName.setAttribute("style", "padding-left: 3px;width: 80%;");
	divA.appendChild(pName);
	
	var imgFaction = document.createElement("img");
	imgFaction.setAttribute("width", "32px");
	imgFaction.setAttribute("height", "32px");
	imgFaction.setAttribute("align", "left");
	imgFaction.setAttribute("style", "margin-left: 10px;width: 20%;");		
	if (bd[id].Faction == 'Colonial') {
		imgFaction.src  = "https://static.wikia.nocookie.net/foxhole_gamepedia_en/images/6/60/Colonial.png";
	}
	else if (bd[id].Faction == 'Warden') {
		imgFaction.src  = "https://static.wikia.nocookie.net/foxhole_gamepedia_en/images/a/a5/Warden.png";
	}
	else {
		imgFaction.src  = "https://imgur.com/TmwmszG.png";
	}
	divA.appendChild(imgFaction);
	
	// ------------------------------------------
	
	var pDescription = document.createElement("p");
	pDescription.innerHTML  = bd[id].Description;
	divB.appendChild(pDescription);
	
	// ------------------------------------------
	
	var pEncumbrance = document.createElement("p");
	pEncumbrance.innerHTML  = "Encumbrance: " + bd[id].Encumbrance + "%";
	divC.appendChild(pEncumbrance);		
	
	if (bd[id].Class != undefined) {		
		var pClass = document.createElement("p");
		pClass.innerHTML  = "Class: " + bd[id].Class;
		divC.appendChild(pClass)
	}
	
	if (bd[id].Ammo != undefined) {		
		var pAmmo = document.createElement("p");
		pAmmo.innerHTML  = "Ammo: " + bd[id].Ammo;
		divC.appendChild(pAmmo)
	}
	if (bd[id].Type != undefined) {		
		var pType = document.createElement("p");
		pType.innerHTML  = "Type: " + bd[id].Type;
		divC.appendChild(pType)
	}
}

function processData(allText) {
	var record_num = 5;  // or however many elements there are in each row
	var allTextLines = allText.split(/\r\n|\n/);
	var entries = allTextLines[0].split(',');
	var lines = [];

	var headings = entries.splice(0,record_num);
	while (entries.length>0) {
		var tarr = [];
		for (var j=0; j<record_num; j++) {
			tarr.push(headings[j]+":"+entries.shift());
		}
		lines.push(tarr);
	}
	// alert(lines);
}