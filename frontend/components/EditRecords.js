import { useState } from "react";
import { Modal, Input, useNotification } from "web3uikit";
import pnsAbi from "../constants/pnsAbi.json";
import { ethers } from "ethers";

export default function EditRecords({ isVisible, name, contractAddress, onClose }) {
    const dispatch = useNotification();
    const [newRecords, setNewRecords] = useState("");

    async function updateRecord() {
        try {
            const { ethereum } = window;
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, pnsAbi, signer);
            const tx = await contract.setRecord(name, newRecords);
            onClose && onClose();
            const txReceipt = await tx.wait(1);
            if (txReceipt.status === 1) {
                handleUpdateRecord();
            }
            console.log(`Record Updated! https://mumbai.polygonscan.com/tx/${tx.hash}`);
        } catch (e) {
            console.log(e);
            console.log("This Error is coming from 'updateRecords'");
        }
    }

    async function handleUpdateRecord() {
        dispatch({
            type: "success",
            title: "Records Updated!",
            message: "Give me party now??",
            position: "topR",
        });
    }

    return (
        <Modal
            isVisible={isVisible}
            onCancel={onClose}
            onCloseButtonPressed={onClose}
            onOk={() => {
                updateRecord();
            }}
        >
            <Input
                label="Update records"
                name="Update records"
                type="text"
                onChange={(event) => {
                    setNewRecords(event.target.value);
                }}
            />
        </Modal>
    );
}
