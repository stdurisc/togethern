//Author: Melvin Laice
//WCAG 2 Edits: Dustin Rischke (i tried to)

import React from 'react';
import './NavigationBar.css'
import Explanation from "./Explanation"
import handshake from "./material/icon_handshake_dark.png";
import wheel from "./material/icon_wheel_dark.png";
import logo from "./material/logo_dark.png"
import ChatWorkplace from "./ChatWorkplace";

class NavigationBar extends React.Component{
    constructor(props) {
        super(props);
        this.state = {showHelp: false}
    }
    render(){
        return(
            <div>
                <nav className="navigationBar">
                    <img className="logo" alt = "Logo of Togethern" src={logo}/>
                    <ul className="navigation">
                        <NavigationRow></NavigationRow>
                    </ul>
                </nav>

            </div>
        );
    }
}
/* Navigations Item Component (in Form von Einstellungen und Hilfe) */
class NavigationRow extends React.Component{
    constructor(props) {
        super(props);
        this.state = {showSettingsDrop: false, showHelpDrop: false, showExplanationDrop: false, showImpressumDrop: false}
    }
    render(){
        /*navigation Items sind: DropDown-Menu-Bereich, Einstellungs-Button, Hilfe-Button*/
        let navigationItems = [];
        navigationItems.push(<div className="dropZone">{this.dropDownMenu()}</div>);
        navigationItems.push(this.navigationItem("help", handshake, "A hand reaching out to help"));
        navigationItems.push(this.navigationItem("settings", wheel, "A Cog Wheel"));
        return(
            <>
            <a className="hiddenNavs" aria-label='Skip to Help' href='#help'>skip to Help </a>
            <a className="hiddenNavs" aria-label='Skip to Settings' href='#settings'>skip to Settings</a>
            {navigationItems}
            </>);
    }

    navigationItem(job, icon, altDesc){
        return(
            <li className="navigationItem">
                <a id={job} className="navigationButton" role='Button' aria-label={'Fold/Unfold drop down menu ' + job} key={job} onClick={() => this.dropControl(job)} href = {"#" +job+"_dropdown"}><img alt={altDesc} src={icon} className="icon"/></a>
                <div id={job+"_dropdown"} className="dropZone">{this.dropDownMenu()}</div>
            </li>
        );
    }
    dropControl(job){
        /*in welchen fällen werden welche drop down menus angezeigt*/
        /*da immer nur ein Dropdown zu sehen sein soll, vorher alle schließen*/
        if(job === "help"){
            if(this.state.showHelpDrop){
                this.setState({showHelpDrop: false})
            }
            else{
                this.setState({showHelpDrop: true});
            }
            this.setState({showSettingsDrop: false, showExplanationDrop: false, showImpressumDrop: false})
        }
        else if(job === "settings"){
            if(this.state.showSettingsDrop){
                this.setState({showSettingsDrop: false})
            }
            else{
                this.setState({showSettingsDrop: true});
            }
            this.setState({showHelpDrop: false, showExplanationDrop: false, showImpressumDrop: false})
        }
        else if(job === "hilfe"){  //explanations
            this.setState({showExplanationDrop: true, showHelpDrop: false, showSettingsDrop: false, showImpressumDrop: false})
        }
        else if(job === "impressum"){
            this.setState({showExplanationDrop: false, showHelpDrop: false, showSettingsDrop: false, showImpressumDrop: true})
        }
    }
    dropDownMenu(){
        let menus=[];
        if(this.state.showSettingsDrop){
            menus.push(
                <>
                <a className="hiddenNavs" aria-label='Skip to autoplay setting' href='#autoplaytoggle'>Skip to autoplay setting</a>
                <div className="dropDownList">
                    <a id="autoplaytoggle" aria-label='toogle autoplay' className="dropDownItem" href="#">Autoplay</a>
                    <a className="hiddenNavs" aria-label='Skip back to Settings' href='#settings'>skip to Settings</a>
                </div>    
                </>
            );
        }
        if(this.state.showHelpDrop){
            menus.push(
                <>
                <a className="hiddenNavs" aria-label='Skip to Help text' href='#helptext'>Skip to Help text</a>
                <a className="hiddenNavs" aria-label='Skip to impressum' href='#impressum'>Skip to impressum</a>
                <div className="dropDownList">
                    <a id='helptext' aria-label='show helptext/manuel' className='dropDownItem' href="#" onClick={() => this.dropControl("hilfe")}>Hilfe</a> {/* //explanations */}
                    <a id='impressum' aria-label='show impressum' className='dropDownItem' href="#" onClick={() => this.dropControl("impressum")}>Impressum</a>

                    <a className="hiddenNavs" aria-label='Skip back to Help' href='#help'>skip to Help </a>
                </div>
                </>
            );
        }
        if(this.state.showExplanationDrop){
            menus.push(
                <div className="hilfe">
                    <p className='Help-text'> 
                        Anwendungsanleitung: <br />
                        Zuerst suchen Sie sich einen Nutzernamen aus und schreiben diesen in das Eingabefeld. <br />
                        Als nächstes drücken sie den Submit Button um ihren Nutzernamen zu übergeben.<br />
                        Nun wird Ihnen auf der rechten Seite eine Raumliste angezeigt. <br />
                        In dieser suchen Sie sich einen Raum aus, dem Sie beitreten möchten. <br />
                        Unter der Liste finden sie einen Button. Dieser Button erstellt einen Raum mit zufälligem Namen. <br />
                        Wenn sie einen Raum gefunden haben, clicken sie auf ihn. <br />
                        Sie finden ihren Raum in der rechten Liste unterstrichen. <br />
                        Nun sind Sie in einem Raum mit ihren Freunden, wo sie über die Input Leiste überhalb des Players einen Video-Link eingeben können. <br />
                        Bestätigen sie mit Enter.<br />
                        Nach Eingabe des Video Links, wird dieses Video synchron für alle Raummiglieder abgespielt. <br />
                        Wenn sie den Raum verlassen möchten, finden sie unter der Raumliste auf der rechten Seite einen Button zum verlassen des Raumes  <br />
                        Sollten sie die letze Person im Raum gewesen sein, wird der Raum gelöscht <br />
                        Auf der linken Seite können Sie alle momentanen Nutzer sehen und schauen ob Ihre Freunde online sind.<br />
                        Sie selbst sind auch in der Liste unterstrichen <br />
                        Vorsicht: Wenn sie die Seite verlassen oder aktualisieren, wird ihre Session gelöscht und sie müssen sich einen neuen Username ausuchen <br />
                    </p>
                    {/* <Explanation/> */}
                    
                </div>
            )
        }
        if(this.state.showImpressumDrop){
            menus.push(
                <div className="impressum">
                    <p>
                    Entwickler und Betreiber: <br/>
                    Dustin Rischke, Leonie Anna Maria Schulte, Melvin Laice <br/>
                    <br/>
                    Kontakt: <br/>
                    0179 123123756 <br/>
                    togethern@web.de <br/>
                    <br/>
                    Im Auftrag von: <br/>
                    Toni Bart | Hochschule Anhalt
                    </p>
                </div>
            );
        }
        return menus;
    }
}


export default NavigationBar;