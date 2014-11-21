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
Mon.prototype.nIncog=function(incNom)
{
	this.incogs.push(incNom);
	this[incNom]=0;
}