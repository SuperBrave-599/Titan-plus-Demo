import Avatar from './lib/avatar';
import Card from './lib/card';
import Dialog from './lib/dialog';
import Form from './lib/form';
import Input from './lib/input';
import Placement from './lib/placement';
import Select from './lib/select';
import Table from './lib/table';
import Tooltip from './lib/tooltip';

const Components = []

const TitanPlus = {
    Avatar,
    Card,
    Dialog,
    Form,
    Input,
    Placement,
    Select,
    Table,
    Tooltip
};

const install = (app, option = {}) => {
    Object.keys(TitanPlus).forEach(name => {
        TitanPlus[name].install(app, option[name.toLowerCase()] || {});
    })
};

export default {
    ...TitanPlus,
    install
};
