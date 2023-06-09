﻿/**
* Postalcode Validation for Postalcode Field in Dynamics365
* @author Marin Ivakovic
* @author R.iT GmbH
* @current version : 1.0
**/

import * as React from "react";
import { useState, useEffect, useRef, useMemo, useLayoutEffect } from "react";
import Modal from "react-modal";

export interface Props {
    zipcode: string | undefined;
}

const ValidatorControl = (props: Props): JSX.Element => {

    const [textColor, setTextColor] = useState("");
    const [data, setData] = useState<{ country: string, state: string, placeName: string } | null>(null);
    const [text, setText] = useState("");
    const [validationEmoji, setValidationIcon] = useState("");
    const [buttonVisibile, setInfoButtonVisibility] = useState(false);
    const [modalIsOpen, setModalVisibility] = useState(false);

    var LabelStyle = {
        color: textColor,
        fontSize: '14px',
        fontWeight: 'bold',
        fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
    };

    const handleClick = () => {
        console.log(data);
        setModalVisibility(true);
    }

    function closeModal() {
        setModalVisibility(false);
    }

    useEffect(() => {
        var zipcodeNumber = props.zipcode ? props.zipcode : "";

        //Postal code format validation. I.e. the german postal code must have exactly 5 digits.
        if (zipcodeNumber == undefined || zipcodeNumber == null || zipcodeNumber.toString().length > 5 || zipcodeNumber.toString().length < 5) {
            //setText when format is not correct.
            setText("Postleitzahl Format ist nicht korrekt formatiert");
            setTextColor("red");
            setValidationIcon("❌");
            setInfoButtonVisibility(false);
            return;
        }
        const xhr = new XMLHttpRequest();

        //Change the API to the country you want to validate your postal code.        
        xhr.open('GET', 'https://api.zippopotam.us/de/' + zipcodeNumber);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const response = JSON.parse(xhr.responseText);
                    setData({
                        country: response.country,
                        placeName: response.places[0]["place name"],
                        state: response.places[0].state,
                    });
                    setTextColor("green");
                    setValidationIcon("✔")
                    setInfoButtonVisibility(true);
                    //setText when postal code is available.
                    setText("Postleitzahl vorhanden");
                }
                //Format is correct, but postal code does not exist.
                else {
                    setTextColor("red");
                    setValidationIcon("❌");
                    setText("Postleitzahl existiert nicht");
                    setInfoButtonVisibility(false);
                    console.log(xhr.statusText);
                }
            }
        };
        xhr.send();
    }, []);

    return (
        //Modal Dialog with additional information.
        <div>
            <label style={LabelStyle} >{text} {validationEmoji} </label>
            {buttonVisibile && <button style={styles.button} onClick={handleClick}>Mehr Infos</button>}
            <Modal
                isOpen={modalIsOpen}
                onRequestClose={closeModal}
                style={styles.customStyles}
                contentLabel="Additional information dialog">
                <h3>Zusätzliche Information:</h3>
                <p>Land: {data?.country}</p>
                <p>Bundesland: {data?.state}</p>
                <p>Stadt: {data?.placeName}</p>
                <button onClick={closeModal} style={styles.closeButton}>Schließen</button>
            </Modal>
        </div>
    )
}

const styles = {
    button: {
        appearance: 'none' as 'none',
        backgroundColor: '#FAFBFC',
        border: '1px solid rgba(27, 31, 35, 0.15)',
        borderRadius: '6px',
        boxShadow: 'rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset',
        boxSizing: 'border-box' as 'border-box',
        color: '#24292E',
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: '11px',
        fontWeight: 500,
        lineHeight: '20px',
        listStyle: 'none',
        padding: '2px 7px',
        position: 'relative' as 'relative',
        transition: 'background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1)',
        userSelect: 'none' as 'none',
        WebkitUserSelect: 'none' as 'none',
        touchAction: 'manipulation',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap' as 'nowrap',
        wordWrap: 'break-word' as 'break-word',
    },

    closeButton: {
        marginTop: '5px',
        appearance: 'none' as 'none',
        backgroundColor: '#FAFBFC',
        border: '1px solid rgba(27, 31, 35, 0.15)',
        borderRadius: '5px',
        boxShadow: 'rgba(27, 31, 35, 0.04) 0 1px 0, rgba(255, 255, 255, 0.25) 0 1px 0 inset',
        boxSizing: 'border-box' as 'border-box',
        color: '#24292E',
        cursor: 'pointer',
        display: 'inline-block',
        fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
        fontSize: '12px',
        fontWeight: 500,
        lineHeight: '20px',
        listStyle: 'none',
        padding: '2px 5px',
        position: 'relative' as 'relative',
        transition: 'background-color 0.2s cubic-bezier(0.3, 0, 0.5, 1)',
        userSelect: 'none' as 'none',
        WebkitUserSelect: 'none' as 'none',
        touchAction: 'manipulation',
        verticalAlign: 'middle',
        whiteSpace: 'nowrap' as 'nowrap',
        wordWrap: 'break-word' as 'break-word',
    },
    title: {
        marginRight: '8px',
    },
    customStyles : {
        content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            fontFamily: '-apple-system, system-ui, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji"',
            fontSize: '14px',
        },
    },
};

export default ValidatorControl;