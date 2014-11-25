Mon=function()
{
	this.cohef=1;
	this.incogs=[];
}
//Elimina la incógnita del nombre pasado por parámetro del monomio.
Mon.prototype.dIncog=function(nIncog)
{
	delete this.incogs[this[nIncog]];
	delete this[nIncog];
}
Mon.prototype.fusMult=function(mon)
{
	log.txt("Mon.cohef= "+this.cohef+" ; nMon.cohef= "+mon.cohef);

	this.cohef*=mon.cohef;

	for(var i=0;i<mon.incogs.length;i++)
	{
		var nIncNom=mon.incogs[i];

		if(!this[nIncNom])
		{
			log.txt("Creada Mon."+nIncNom);
			this.nIncog(nIncNom);
		}

		log.txt("Exponente "+nIncNom+" = "+this[nIncNom]+" + "+mon[nIncNom]);
		this[nIncNom]+=mon[nIncNom];
	}
}
Mon.prototype.getRefMon=function(rMon)
{
	for(var i=0;i<rMon.incogs.length;i++)
	{
		nInc=rMon.incogs[i];

		this.nIncog(nInc);

		this[nInc]=rMon[nInc];
	}

	this.cohef=rMon.cohef;
}
Mon.prototype.fusDiv=function(){}
Mon.prototype.fus
Mon.prototype.nIncog=function(incNom)
{
	this.incogs.push(incNom);
	this[incNom]=0;
}