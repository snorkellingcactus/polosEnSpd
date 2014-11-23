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
	log.txt('Cohef = '+this.cohef);
	this.cohef*=mon.cohef;

	for(var i=0;i<mon.incogs.length;i++)
	{
		var nIncNom=mon.incogs[i];

		if(!this[nIncNom])
		{
			this.nIncog(nIncNom);
		}

		this[nIncNom]+=mon[nIncNom];
	}
}
Mon.prototype.nIncog=function(incNom)
{
	this.incogs.push(incNom);
	this[incNom]=0;
}