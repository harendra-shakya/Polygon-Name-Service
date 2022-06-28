import { useState } from "react";
import { Card } from "web3uikit";
import EditRecords from "./EditRecords";

export default function RecentlyMinted({ name, record, owner, contractAddress }) {
    const domainName = `${name}.eth`;
    const [showModal, setShowModal] = useState(false);
    const hideModal = () => setShowModal(false);

    async function handleCardClick() {
        if (owner) {
            setShowModal(true);
        }
    }

    return (
        <div
            className="hover:space-x-2 "
            style={{
                width: "170px",
            }}
        >
            <EditRecords
                isVisible={showModal}
                name={name}
                contractAddress={contractAddress}
                onClose={hideModal}
            />
            <Card description={record} title={domainName} onClick={handleCardClick}></Card>
        </div>
    );
}
