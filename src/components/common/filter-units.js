export default function filterUnits(units) {
    let filteredUnits = units.filter(item => item.checked);
    filteredUnits.forEach(item => { delete item.checked });
    return filteredUnits;
}