const mongoose = require('mongoose')

const Metalurgia_Inputschema = mongoose.Schema({
    IX:Number,
    IY: Number,
    IZ: Number,
    OreType: Number,
    TMS: Number,
    Percentage_CuT : Number,
    Percentage_CuAS : Number,
    Percentage_CuCN : Number,
    Percentage_Fe: Number,
    Ag_cab_gt: Number,
    Percentage_S: Number,
    deleted: { type: Boolean, default: false }
},
    {
        timestamps: true
    })


const Metalurgia_Input = mongoose.model('Metalurgia_Input', Metalurgia_Inputschema, 'Metalurgia_Input')
module.exports = Metalurgia_Input