import $ from "jquery";
import {useState} from "react";
import {useHistory} from "react-router";

export default function SearchModalComponent () {
    const  history  = useHistory()
    const [form, setForm] = useState({
       search_type:'story',
        search: '',
    });

    function onChangeForm(e){
        // console.log(e.target.value)
        setForm({
            ...form,
            [e.target.getAttribute('name')]: e.target.value
        })


    }

    function onSubmitForm(e){
        e.preventDefault()

        switch (form.search_type){
            case 'story':
                window.location.href = `/stories?search=${form.search}`;
                break
            case 'poem' :
                window.location.href = `/poems?search=${form.search}`;
                break
            case 'video' :
                window.location.href = `/videos?search=${form.search}`;
                break
            case 'movie' :
                window.location.href = `/movies?search=${form.search}`;
                break
            case 'audio' :
                window.location.href = `/audios?search=${form.search}`;
                break
            default :
                break
        }
        // window.jQuery.modal("hide");


    }




    return (
        <div className="search_box">
            <div id="search-modal" className="modal fade" role="dialog">
                <div className="modal-dialog model-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal">&times;</button>
                        </div>
                        <div className="modal-body">
                            <div className="search_bar">
                                <div className="search-area">
                                    <form onChange={onChangeForm} onSubmit={onSubmitForm} >
                                        <div className="control-group">
                                            <select className="form-control" name='search_type' value={form.search_type}>
                                                <option value='story'>Story</option>
                                                <option value='poem'>Poem</option>
                                                <option value='audio'>Audio</option>
                                                <option value='video'>Video</option>
                                                {/* <option value='movie'>Movie</option> */}
                                            </select>
                                            <input className="search-field" name='search' placeholder="Type and Search" value={form.search} />
                                            <button type="submit" className="btn for_search"><img
                                                src="/images/search.png" alt="" /></button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )

}