const Gettext = imports.gettext;
const Lang = imports.lang;

const Atk = imports.gi.Atk;
const Meta = imports.gi.Meta;
const St = imports.gi.St;

const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;


const StatusIcon = new Lang.Class({
    Name: 'StatusIcon',
    Extends: St.BoxLayout,

    _init: function() {
        this.parent({ style_class: 'panel-status-indicators-box' });
            
        this._icon = new St.Icon({
            icon_name: 'video-display-symbolic',
            style_class: 'system-status-icon indicator-disabled'
        });
        this.add_child(this._icon);
    },
    
    enable: function() {
        this._icon.remove_style_class_name('indicator-disabled');
    },
    
    disable: function() {
        this._icon.add_style_class_name('indicator-disabled');
    }
});


const Indicator = new Lang.Class({
    Name: 'Indicator',
    Extends: PanelMenu.Button,

    _init: function() {
        this.parent(0.0, "Indicator");
        this.actor.accessible_role = Atk.Role.TOGGLE_BUTTON;
        this.state = false;
        
        /* Menu Indicator */
        this._statusIcon = new StatusIcon();
        this.actor.add_child(this._statusIcon);        
        
        this.actor.connect('button-press-event', Lang.bind(this, this.toggle_state));
        
    },

    toggle_state: function() {
        this.state = !this.state;
        if (this.state) {
        	Meta.disable_unredirect_for_screen(global.screen);
        	this._statusIcon.enable()
            Main.notify(_('Unredirect Rendering'), _('Disable unredirect rendering'));
        } else {
        	Meta.enable_unredirect_for_screen(global.screen);
        	this._statusIcon.disable()
            Main.notify(_('Unredirect Rendering'), _('Enable unredirect rendering'));
    	}  
    },
    
    disable: function() {
        if (this.state) {
            Meta.enable_unredirect_for_screen(global.screen);
        }
    
        this.destroy();
    }
});



