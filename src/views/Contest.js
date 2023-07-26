import Layout from "../Layout/Layout";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {useParams} from "react-router";
import { getContests } from "./utilities/ApiCalls";
import { statusFailure, perPage } from "./Constant";

export default function Contest() {

    const [contests, setContest] = useState([]);
    const [pageNo, setPageNo] = useState(1);
    const [length, setLength] = useState(1);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    let { type } = useParams();

    useEffect(() => {
        getContests({ 'moduleType': type }).then((response) => {
            if (response.status !== statusFailure) {
                setSuccessMessage(response.message);
                setContest(response.data);
                setPageNo(response.pageNo);
                setLength(response.length);
            } else {
                setErrorMessage(response.message);
            }
        }).catch((error) => {
            setErrorMessage(error.message);
        });
    }, []);

    let bodyData = [];
    
    if(contests.length > 0) {
        let i = (pageNo - 1) * perPage;
        bodyData = contests.map(el => {
            i++;
            let date = el.createdAt.split('T')[0];
            let redirectURL = (type === '1') ? `/stories?contest=${el._id}` : `/poems?contest=${el._id}`;

            return <tr>
                <td>{ i }</td>
                <td>{ el._id }</td>
                <td>{ el.name }</td>
                <td>{ date }</td>
                <td>{ el.count }</td>
                <td><Link to={ redirectURL } className="btn btn-warningbtn btn-info btn-sm">View</Link></td>
            </tr>
        });
    }

    return <>
        <Layout>
            <section className="about_section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 col-sm-12 col-md-12 col-12">
                            <div className="heading_title mt-30">
                                <h1>Contest</h1>
                                <p className="text-danger">{ errorMessage }</p>
                            </div>
                          
                            <div className="about_info mt-4">
                                <div class="contest_section">
                                    <div class="row">
                                        <div class="col-lg-12 col-sm-12 col-md-12 col-12">
                                            <div className="table-responsive">
                                            <table class="table">
                                                <thead>
                                                    <tr>
                                                        <th>#</th>
                                                        <th>ID</th>
                                                        <th>Name</th>
                                                        <th>Date</th>
                                                        <th>Count</th>
                                                        <th>View</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    { bodyData }
                                                </tbody>
                                            </table>
                                            </div>
                                        </div>
                                    </div>
                                </div> 
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    </>
}