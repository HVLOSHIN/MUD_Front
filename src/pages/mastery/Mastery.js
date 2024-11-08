import React from 'react';
import MasteryStatsSummary from "./MasteryStatsSummary";
import MasterySlot from "./MasterySlot";
import '../equipment/Equipment.css';

const Mastery = () => {


    return (
        <div>
            <MasteryStatsSummary/>
            <div className="equipment-container">
                <MasterySlot/>
            </div>
        </div>
    );
};
export default Mastery;