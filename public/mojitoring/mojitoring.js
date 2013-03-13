/**
 * Mojitoring Admin
 * steven@w33kn.com
**/

var Mojitoring =
{
	Initialize: function ()
	{
		var self = Mojitoring;

		// Activate tooltips
		$("[data-title]").tooltip();	
	},
	LoadHTML: function ($container, url, cb)
	{
		if ($(".inlineMarker", $container).length === 0)
		{
			if (!url || !url.length)
			{
				alert("Mojitoring.LoadHTML error: missing html url.");
				return;
			}
			$container.load(url, cb);
		}
		else
		{
			if (cb)
				cb();
		}
	},
	LoadMX: function ($container, url, data, inlineWidgetId, cb)
	{
		// jQueryMX
		
		if ($("#inlineServerStatus").length > 0)
		{
			if (!inlineWidgetId || !inlineWidgetId.length)
			{
				alert("Mojitoring.LoadMX error: missing inlineWidgetId.");
				return;
			}
			$container.html(inlineWidgetId, data, cb);
		}
		else
		{
			if (!url || !url.length)
			{
				alert("Mojitoring.LoadMX error: missing widget url");
				return;
			}
			$container.html(url, data, cb);
		}
	}
};
$(Mojitoring.Initialize);

var wTakeTour =
{
	initDone: false,
	Initialize: function ()
	{
		var self = wTakeTour;

		self.initDone = true;

		guidely.add({
			attachTo: '#wUserButton',
			anchor: 'bottom-left',
			title: 'User menu',
			text: 'Customize the user menu at your fancy.'
		});

		guidely.add({
			attachTo: '#wServerCommand',
			anchor: 'top-right',
			title: 'Server commands',
			text: 'Use cases examples:<br /> - Remote the deployment<br /> - Remote recurrent tasks'
		});

		guidely.add({
			attachTo: '#wServerStatus1',
			anchor: 'bottom-left',
			title: 'Server monitor',
			text: 'Use cases examples:<br /> - control your web server <br /> - control any applications or services <br /> - reboot your server or restart a service<br /> - manage your server pool or application pool'
		});

		guidely.add({
			attachTo: '#wRealtimeGraph',
			anchor: 'bottom-left',
			title: 'Real time graph',
			text: 'You can display any real time data, the customization is very simple.'
		});

		guidely.add({
			attachTo: '#wRealtimeData1',
			anchor: 'top-right',
			title: 'Real time banner',
			text: 'Real time data banner, just customize it at your will.'
		});

		guidely.add({
			attachTo: '#wUserFeature',
			anchor: 'top-left',
			title: 'User features Manager',
			text: 'Use cases examples:<br />- enable/disable features on the client website<br />- start/stop mailing campaign'
		});


		guidely.add({
			attachTo: '#wErrorTracker',
			anchor: 'top-left',
			title: 'Real time table',
			text: 'Customizable real time data table.'
		});

		guidely.add({
			attachTo: '#wUserTracker',
			anchor: 'top-left',
			title: 'Real time table',
			text: 'Actually, every widget is cutomizable<br />Bought this template. Satisfaction guaranteed!'
		});

	},
	Show: function ()
	{
		var self = wTakeTour;

		if (!self.initDone)
			self.Initialize();

		guidely.init({
			startTrigger: false,
			welcome: false,
			welcomeTitle: 'Welcome to Train the Trainer Power Set Tour!',
			welcomeText: 'Click to start a brief tour of what is included.'
		});
	}
};