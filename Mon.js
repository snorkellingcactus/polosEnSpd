Mon=function()
{
	this.cohef=1;
	this.incogs=[];
}
Mon.prototype.dIncog=function(nIncog)
{
	delete this.incogs[this[nIncog]];
	delete this[nIncog];
}