import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useMoralis, useWeb3Contract } from "react-moralis";
import { Form, useNotification, Input, Button } from "web3uikit";
import pnsAbi from "../constants/pnsAbi.json";
import contractAddresses from "../constants/contractAddresses.json";
import { useEffect, useState } from "react";
import RecentlyMinted from "../components/RecentlyMinted";
import { ethers } from "ethers";

export default function Home() {
    const { isWeb3Enabled, chainId, account } = useMoralis();
    const [mints, setMints] = useState([]);
    const [domainName, setDomainName] = useState("");
    const [record, setRecord] = useState("");
    const dispatch = useNotification();
    const chainString = chainId ? parseInt(chainId).toString() : "31337";
    const contractAddress = contractAddresses[chainString].PNS[0];

    const fetchMints = async () => {
        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, pnsAbi, signer);
                const allNames = await contract.getAllNames();

                const mintRecords = await Promise.all(
                    allNames.map(async (name) => {
                        const mintRecord = await contract.records(name);
                        const owner = await contract.domains(name);
                        return {
                            id: allNames.indexOf(name),
                            name: name,
                            record: mintRecord,
                            owner: owner,
                        };
                    })
                );

                setMints(mintRecords);
            }
        } catch (e) {
            console.log(e);
            console.log("This error os coming from fetch mints");
        }
    };

    async function updateUI() {
        fetchMints();
    }

    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI();
        }
    }, [isWeb3Enabled, mints]);

    async function register() {
        if (domainName.length < 3 && domainName.length < 11) {
            alert("Domain name must be at least 3 characters long");
            return;
        }

        try {
            const { ethereum } = window;
            if (ethereum) {
                const provider = new ethers.providers.Web3Provider(ethereum);
                const signer = provider.getSigner();
                const contract = new ethers.Contract(contractAddress, pnsAbi, signer);
                const price =
                    domainName.length === 3 ? "0.5" : domainName.length === 4 ? "0.3" : "0.1";
                console.log("Minting domain", domainName, "with price", price);

                let tx = await contract.register(domainName, {
                    value: ethers.utils.parseEther(price),
                });
                const txReceipt = await tx.wait(1);

                if (txReceipt.status === 1) {
                    console.log(`Domain minted! https://mumbai.polygonscan.com/tx/${tx.hash}`);
                    handleRegisterSuccess();
                }

                tx = await contract.setRecord(domainName, record);
                await tx.wait(1);

                console.log(`Record set! https://mumbai.polygonscan.com/tx/${tx.hash}`);

                setTimeout(() => {
                    fetchMints();
                }, 2000);
            } else {
                console.log("transaction failed");
            }
        } catch (e) {
            console.log(e);
            console.log("This error is coming from register");
        }
    }

    async function handleRegisterSuccess() {
        dispatch({
            type: "success",
            title: "Domain Registered",
            message: "U can check you domain on OpenSea",
            position: "topR",
        });
    }

    return (
        <div>
            {isWeb3Enabled ? (
                <div>
                    {parseInt(chainId) == 80001 ? (
                        <div>
                            <div className="pt-10 pl-8 space-y-6">
                                <h2 className="font-semibold text-2xl text-gray-500">
                                    Register Your Domain
                                </h2>
                                <Input
                                    label="Domain Name"
                                    name="Domain Name"
                                    type="text"
                                    onChange={(e) => {
                                        setDomainName(e.target.value);
                                    }}
                                />
                                <Input
                                    label="Your Msg"
                                    name="Records"
                                    type="text"
                                    onChange={(e) => {
                                        setRecord(e.target.value);
                                    }}
                                />
                                <Button
                                    id="test-button"
                                    onClick={register}
                                    text="Submit"
                                    theme="secondary"
                                    type="button"
                                />
                            </div>
                            <div className="py-5">
                                <div className="py-4 pl-8 font-semibold text-2xl">
                                    Recently Minted Domains
                                </div>
                                <div className="flex flex-wrap pl-8">
                                    {mints
                                        .slice()
                                        .reverse()
                                        .map((mint, i) => {
                                            if (i < 15) {
                                                const owner =
                                                    account == mint.owner.toLowerCase() ||
                                                    undefined;
                                                return (
                                                    <div className="py-2 px-2">
                                                        <RecentlyMinted
                                                            name={mint.name}
                                                            record={mint.record}
                                                            owner={owner}
                                                            contractAddress={contractAddress}
                                                        />
                                                    </div>
                                                );
                                            }
                                        })}
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div>Please Connect to Polygon Mumbai</div>
                    )}
                </div>
            ) : (
                <div>Please Connect your wallet</div>
            )}
        </div>
    );
}
