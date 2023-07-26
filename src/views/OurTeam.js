import Layout from "../Layout/Layout";
import {useEffect, useState} from "react";
import { getPages } from "./utilities/ApiCalls";

export default function OurTeam() {
    const [about, setAbout] = useState({});

    useEffect(() => {
        getPages({ 'title': 'our partner' }).then((response) => {
            setAbout(response.data);
        })
    }, []);

    return (
        <Layout>
            <section className="about_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="heading_title mt-30">
                                <h1>{ about.title }</h1>
                            </div>
                            <hr/>
                            <div className="about_info">
                                <p>{ about.content }</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    )
}