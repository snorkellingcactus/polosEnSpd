Log=function()
{
	this.buff="";
	this.splTxt=":::::::::::::::::::::::::::::::::::::::::::::::::::";
	this.enable=false;
	this.arrayDef=false;
	this.cambio=false;
	this.niv=0;
	this.html='';
	this.fnLlave=function(tipo , estado)
	{
		switch(tipo)
		{
			case 0: 	//Llave
				if(estado)
				{
					this.html+='<div class="llave">{';
				}
				else
				{
					this.html+='}</div>';
				}
			break;
			case 2:		//Paréntesis
				if(estado)
				{
					this.html+='<div class="paren">(';
				}
				else
				{
					this.html+=')</div>';
				}
			break;
			case 1:		//Corchete
				if(estado)
				{
					this.html+='<div class="corcho">[';

				}
				else
				{
					this.html+=']</div>';
				}
			break;
		}
	};
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
	var llave=0;
	
	if(esArr)
	{
		llave=1;
	}
	if(esArr || esObj)
	{

		for(var clave in param)
		{
			var prop=param[clave];

			if(clave=='log'||prop instanceof(Log))
			{
				continue;
			}
			if(param.hasOwnProperty(clave))
			{
				this.fnLlave(llave,1);
				this.niv++;
				this.html+='<font class="clave">'+clave+':</font>';
				this.arrayStr(prop,clave);
				this.niv--;
				this.fnLlave(llave,0)
			}
		}
	}
	else
	{
		this.html+='<font class="param">'+param+',</font>';
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
			this.fnLlave(2,0);
			this.arrayDef=false;
			this.buff+=this.html;
			this.html='';
		}
	}
	else
	{
		this.fnLlave(2,1);
		this.arrayDef=true;
	}
}