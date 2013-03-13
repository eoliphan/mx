/**
 * Mojitoring
 * steven@w33kn.com
**/

// --------------------------------
// Date prototype : used everywhere
// --------------------------------
var DateTimeCulture =
{
	"default":
	{
		firstDay: 0,
		datePattern: "MMM d yyyy",
		dateTinyPattern: "MM #d# yyyy",
		dateLongPattern: "dddd MMMM d yyyy",
		timePattern: "hh:mm:ss tt",
		MMM: ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"],
		MMMM: ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"],
		tinyDays: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
		ddd: ["sun", "mon", "tue", "wed", "thu", "fri", "sat"],
		dddd: ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"]
	},
	"fr":
	{
		firstDay: 1,
		datePattern: "d MMM yyyy",
		dateTinyPattern: "d MM yyyy",
		dateLongPattern: "dddd d MMMM yyyy",
		timePattern: "HH:mm:ss",
		MMM: ["jan", "fév", "mar", "avr", "mai", "jun", "jui", "aoû", "sep", "oct", "nov", "déc"],
		MMMM: ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"],
		tinyDays: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
		ddd: ["dim", "lun", "mar", "mer", "jeu", "ven", "sam"],
		dddd: ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
	},
	currentCultureCode: "default"
};

/* String toInteger */
String.prototype.asIntegerFormat = function(strPattern)
{
	// pattern ex : 000
	var pref = strPattern.substring(this.length);
	return pref + this;
}

/* String toDate */
String.prototype.toDatePattern = function (pattern)
{
	pattern = pattern || DateTimeCulture[DateTimeCulture.currentCultureCode].datePattern;

	var date = {};

	var cString = this;
	var rePatternSet = /[yMdHhms]/;

	var localPattern = "";

	var prePatix = "";
	var postPatix = "";

	var car = "";
	var lastCar = "";
	var isFixedLength = false;

	var i = 0;
	while (i < pattern.length)
	{
		car = pattern[i];

		if (rePatternSet.test(car))
		{
			if ((car === lastCar) || localPattern.length === 0)
				localPattern += car;
			else
				isFixedLength = true;
		}
		else
		{
			if (localPattern.length === 0)
				prePatix += car;
			else
				postPatix = car;
		}

		if (!isFixedLength)
			i++;

		if (isFixedLength || (postPatix.length > 0) || (i >= pattern.length))
		{
			//prePatix = prePatix.replace(" ", "\s");
			var re = "";

			if (postPatix.length)
			{
				//postPatix = postPatix.replace(" ", "\s");
				//alert("^" + prePatix + "(.[^" + postPatix + "]*)" + postPatix);
				re = new RegExp("^" + prePatix + "(.[^" + postPatix + "]*)" + postPatix);
			}
			else
			{
				//alert("^" + prePatix + "(.{" + String(localPattern.length) + "})");
				re = new RegExp("^" + prePatix + "(.{" + String(localPattern.length) + "})");
			}
			var match = re.exec(cString);

			date[localPattern] = match[1];

			cString = cString.substr(match[0].length);

			if ((cString.length === 0) || (i === pattern.length))
			{
				if (date.M)
					date.M--;
				else
				{
					if (date.MM)
						date.M = date.MM - 1;

					if (date.MMM)
					{
						var MMMs = DateTimeCulture[DateTimeCulture.currentCultureCode].MMM;
						date.M = $.inArray(date.MMM, MMMs);
					}

					if (date.MMMM)
					{
						var MMMMs = DateTimeCulture[DateTimeCulture.currentCultureCode].MMMM;
						date.M = $.inArray(date.MMMM, MMMMs);
					}
				}

				if (date.M && date.M < 0)
					date.M = 0;

				return new Date(
					date.yyyy || date.yy || 0,
					date.M,
					date.dd || date.d || 0,
					date.HH || date.hh || date.h || 0,
					date.mm || date.m || 0,
					date.ss || date.s || 0);
			}

			prePatix = "";
			postPatix = "";
			localPattern = "";
			isFixedLength = false;
		}

		lastCar = car;
	}
};

/* Number prototype for date */
Number.prototype.isLeapYear = function ()
{
	return (this & 3) && ((this % 100 !== 0) || (this % 400 === 0))
}


// Make Date compatible with Microsoft JSON Date
Date.prototype.toJSON = function (key)
{
	return "\\/Date(" + String(this.getTime()) + ")\\/";
};

Date.prototype.formatDateTime = function (pattern)
{
	pattern = this.formatTime(pattern);
	return (this.formatDate(pattern));
};

Date.prototype.formatDate = function (pattern, formatOption)
{
	if (!pattern)
	{
		switch (formatOption)
		{
			case "tiny":
				pattern = DateTimeCulture[DateTimeCulture.currentCultureCode].dateTinyPattern;
				break;
			case "long":
				pattern = DateTimeCulture[DateTimeCulture.currentCultureCode].dateLongPattern;
				break;
			default:
				pattern = DateTimeCulture[DateTimeCulture.currentCultureCode].datePattern;
				break;
		}
	}
	// Reformat pattern (example: 'd' could be misunderstood when formating)


	var yyyy = String(this.getFullYear()).asIntegerFormat("0000");
	var yy = String(this.getYear()).asIntegerFormat("00");
	var month = this.getMonth();
	var M = String(month + 1);
	var MM = M.asIntegerFormat("00");
	var d = String(this.getDate());
	var dd = d.asIntegerFormat("00");
	var day = this.getDay();
	var ddd = DateTime.currentCulture.ddd[day];
	var dddd = DateTime.currentCulture.dddd[day];

	pattern = pattern.replace("yyyy", yyyy);
	pattern = pattern.replace("yy", yy);

	pattern = pattern.replace("dddd", dddd);
	pattern = pattern.replace("ddd", ddd);
	pattern = pattern.replace("dd", dd);
	pattern = pattern.replace(/d(?=[^a-zA-Z])/, d);

	// should be done at last, coz alphacode
	var MMMs = DateTimeCulture[DateTimeCulture.currentCultureCode].MMM;
	var MMMMs = DateTimeCulture[DateTimeCulture.currentCultureCode].MMMM;

	pattern = pattern.replace("MMMM", MMMMs[month]);
	pattern = pattern.replace("MMM", MMMs[month]);
	pattern = pattern.replace("MM", MM);
	pattern = pattern.replace("M", M);

	return (pattern);
}

Date.prototype.formatTime = function (pattern)
{
	pattern = pattern || DateTimeCulture[DateTimeCulture.currentCultureCode].timePattern;

	var H = this.getHours();

	var h = (H > 12) ? H - 12 : H;

	H = String(H);
	h = String(h);

	var HH = H.asIntegerFormat("00");
	var hh = h.asIntegerFormat("00");
	var m = String(this.getMinutes());
	var mm = m.asIntegerFormat("00");
	var s = String(this.getSeconds());
	var ss = s.asIntegerFormat("00");
	var tt = (h > 12) ? 'pm' : 'am';

	pattern = pattern.replace("HH", HH);
	pattern = pattern.replace("hh", hh);
	pattern = pattern.replace("H", H);
	pattern = pattern.replace("h", h);
	pattern = pattern.replace("mm", mm);
	pattern = pattern.replace("m", m);
	pattern = pattern.replace("ss", ss);
	pattern = pattern.replace("s", s);

	return (pattern);
}


Date.prototype.getDeltaDayDate = function (deltaDay)
{
	var date = new Date(this);
	date.setDate(this.getDate() + deltaDay);
	return (date);
},

Date.prototype.quantieme = function ()
{
	return Math.floor((this - new Date(this.getFullYear(), 0, 1)) / 86400000) + 1;
};


// DateTime helper
var DateTime =
{
	currentCulture: null,
	Initialize: function ()
	{
		var self = DateTime;

		// Reset default value
		self.currentCulture = DateTimeCulture["default"];
	},
	SetLanguageCode: function (cultureCode)
	{
		var self = DateTime;

		if (DateTimeCulture[cultureCode])
		{
			DateTimeCulture.currentCultureCode = cultureCode;
			self.currentCulture = DateTimeCulture[DateTimeCulture.currentCultureCode];
		}
	}
};

DateTime.Initialize();