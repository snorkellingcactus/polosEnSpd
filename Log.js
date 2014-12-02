Log=function()
{
	this.buff="";
	this.splTxt=":::::::::::::::::::::::::::::::::::::::::::::::::::";
	this.enable=false;
	this.arrayDef=false;
	this.cambio=false
}
Log.prototype.fn=function(nombre)
{
	if(!this.enable){return};this.cambio=1
	this.buff+="<h2>"+nombre+"</h2>";
};
Log.prototype.sep=function()
{
	if(!this.enable){return};this.cambio=1
	this.buff+="<p>"+this.splTxt+"</p>";
};
Log.prototype.br=function(num)
{
	if(!this.enable){return};this.cambio=1
	for(var j=0;j<num;j++)
	{
		this.buff+="<br>";
	}
}
Log.prototype.txt=function()
{
	if(!this.enable){return};this.cambio=1
	for(var j=0;j<arguments.length;j++)
	{
		this.buff+="<p>"+arguments[j]+"</p>";
	}
}
Log.prototype.arrayStr=function(param,clave)
{
	if(!this.enable){return};this.cambio=1

	var tipo=param.constructor.toString();
	var esArr=tipo.indexOf("Array()")!=-1;
	var esObj=typeof param == 'object';
	var clase="objEle";
	var sep=["{","}"];
	
	if(esArr)
	{
		clase="arrEle";
		sep=["[","]"];
	}
	if(esArr || esObj)
	{
		this.buff+=" "+sep[0]+" ";
		for(var clave in param)
		{
			var prop=param[clave];
			if(param.hasOwnProperty(clave))
			{
				this.buff+="<font class='"+clase+"'>"+clave+":</font>";
				this.arrayStr(prop,clave);
			}
		}
		this.buff=this.buff.substr(0,this.buff.length-1)+" "+sep[1]+" ";
	}
	else
	{
		this.buff+=" "+param+" ,";
	}
}
Log.prototype.array=function()
{
	if(!this.enable){return};this.cambio=1
	if(this.arrayDef)
	{
		if(arguments.length)
		{
			this.arrayStr(arguments[0],arguments[1]);
		}
		else
		{
			this.buff+=")</p>"
			this.arrayDef=false;
		}
	}
	else
	{
		this.buff+="<p>Array(";
		this.arrayDef=true;
	}
}