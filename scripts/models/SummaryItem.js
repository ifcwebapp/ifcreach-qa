///<reference path='../typings/knockout/knockout.d.ts' />
var models;
(function (models) {
    var SummaryItem = (function () {
        function SummaryItem(msmeData, indData, type) {
            this.type = 'empty';
            this.msmeData = msmeData;
            this.indData = indData;
            this.type = type;

            switch (type) {
                case 'country':
                    this.Name = msmeData[0];
                    this.EnterprisesCount = this.getIntValue(msmeData[5]);
                    this.A2F = this.parseFloatValue(msmeData[10]);
                    this.A2F += (this.A2F != "" ? '%' : '');
                    this.Checking = this.parseIntValue(msmeData[6]);
                    this.Overdratf = this.parseIntValue(msmeData[7]);
                    this.Loan = this.parseIntValue(msmeData[8]);
                    this.Credit = this.parseIntValue(msmeData[9]);
                    this.DoesNotNeedCredit = this.parseIntValue(msmeData[11]);
                    this.Unserved = this.parseIntValue(msmeData[12]);
                    this.Underserved = this.parseIntValue(msmeData[13]);
                    this.Wellserved = this.parseIntValue(msmeData[14]);
                    this.SourcePrivate = this.parseIntValue(msmeData[15]);
                    this.SourceGov = this.parseIntValue(msmeData[16]);
                    this.SourceNonBank = this.parseIntValue(msmeData[17]);
                    this.SourceOther = this.parseIntValue(msmeData[18]);
                    this.Gdp2005 = this.getIntValue(this.indData[3]);
                    this.GdpCurrent = this.getIntValue(this.indData[4]);
                    this.Atms = this.parseFloatValue(this.indData[5]);
                    this.BankBranches = this.parseFloatValue(this.indData[6]);
                    this.PosTerminals = this.parseFloatValue(this.indData[7]);
                    this.DomesticCredit = this.parseFloatValue(this.indData[8]);
                    this.LendingIr = this.parseFloatValue(this.indData[9]);
                    this.Population = this.getIntValue(this.indData[10]);
                    this.PopulationAges = this.parseFloatValue(this.indData[29]);
                    this.MobileSubscriptions = this.parseFloatValue(this.indData[12]);
                    this.LaborForce = this.getIntValue(this.indData[13]);
                    this.EmploymentRatio = this.parseFloatValue(this.indData[14]);
                    this.PovertyRatio = this.parseFloatValue(this.indData[15]);
                    this.LegalRightsStrength = this.parseFloatValue(this.indData[16]);
                    this.CreditDepth = this.parseFloatValue(this.indData[17]);
                    this.EaseOfBusiness = this.parseFloatValue(this.indData[18]);
                    this.LiteracyRate = this.parseFloatValue(this.indData[19]);
                    this.DepositIr = this.parseFloatValue(this.indData[20]);
                    this.Unemployment = this.parseFloatValue(this.indData[21]);
                    this.IrSpread = this.parseFloatValue(this.indData[22]);
                    this.PrivateCreditCoverage = this.parseFloatValue(this.indData[23]);
                    this.PublicCreditCoverage = this.parseFloatValue(this.indData[24]);
                    this.LaborMale = this.parseFloatValue(this.indData[25]);
                    this.LaborFemale = this.parseFloatValue(this.indData[26]);
                    this.UrbanPopulation = this.parseFloatValue(this.indData[27]);
                    break;
                case 'region':
                    this.Name = msmeData[0];
                    this.EnterprisesCount = this.getIntValue(msmeData[5]);
                    this.A2F = this.parseFloatValue(msmeData[10]);
                    this.A2F += (this.A2F != "" ? '%' : '');
                    this.Checking = this.parseIntValue(msmeData[6]);
                    this.Overdratf = this.parseIntValue(msmeData[7]);
                    this.Loan = this.parseIntValue(msmeData[8]);
                    this.Credit = this.parseIntValue(msmeData[9]);
                    this.DoesNotNeedCredit = this.parseIntValue(msmeData[11]);
                    this.Unserved = this.parseIntValue(msmeData[12]);
                    this.Underserved = this.parseIntValue(msmeData[13]);
                    this.Wellserved = this.parseIntValue(msmeData[14]);
                    this.SourcePrivate = this.parseIntValue(msmeData[18]);
                    this.SourceGov = this.parseIntValue(msmeData[19]);
                    this.SourceNonBank = this.parseIntValue(msmeData[20]);
                    this.SourceOther = this.parseIntValue(msmeData[21]);
                    this.Gdp2005 = this.getIntValue(this.indData[0]);
                    this.GdpCurrent = this.getIntValue(this.indData[1]);
                    this.Atms = this.parseFloatValue(this.indData[2]);
                    this.BankBranches = this.parseFloatValue(this.indData[3]);
                    this.PosTerminals = this.parseFloatValue(this.indData[4]);
                    this.DomesticCredit = this.parseFloatValue(this.indData[5]);
                    this.LendingIr = this.parseFloatValue(this.indData[6]);
                    this.Population = this.getIntValue(this.indData[7]);
                    this.PopulationAges = this.parseFloatValue(this.indData[25]);
                    this.MobileSubscriptions = this.parseFloatValue(this.indData[9]);
                    this.LaborForce = this.getIntValue(this.indData[10]);
                    this.EmploymentRatio = this.parseFloatValue(this.indData[11]);
                    this.PovertyRatio = this.parseFloatValue(this.indData[12]);
                    this.LegalRightsStrength = this.parseFloatValue(this.indData[13]);
                    this.CreditDepth = this.parseFloatValue(this.indData[14]);
                    this.EaseOfBusiness = this.parseFloatValue(this.indData[15]);
                    this.LiteracyRate = this.parseFloatValue(this.indData[16]);
                    this.DepositIr = this.parseFloatValue(this.indData[17]);
                    this.Unemployment = this.parseFloatValue(this.indData[18]);
                    this.IrSpread = this.parseFloatValue(this.indData[19]);
                    this.PrivateCreditCoverage = this.parseFloatValue(this.indData[20]);
                    this.PublicCreditCoverage = this.parseFloatValue(this.indData[21]);
                    this.LaborMale = this.parseFloatValue(this.indData[22]);
                    this.LaborFemale = this.parseFloatValue(this.indData[23]);
                    this.UrbanPopulation = this.parseFloatValue(this.indData[24]);
                    break;
                case 'development':
                    this.Name = msmeData[0];
                    this.EnterprisesCount = this.getIntValue(msmeData[1]);
                    this.A2F = this.parseFloatValue(msmeData[2]);
                    this.A2F += (this.A2F != "" ? '%' : '');
                    this.Checking = this.parseIntValue(msmeData[3]);
                    this.Overdratf = this.parseIntValue(msmeData[4]);
                    this.Loan = this.parseIntValue(msmeData[5]);
                    this.Credit = this.parseIntValue(msmeData[6]);
                    this.DoesNotNeedCredit = this.parseIntValue(msmeData[7]);
                    this.Unserved = this.parseIntValue(msmeData[8]);
                    this.Underserved = this.parseIntValue(msmeData[9]);
                    this.Wellserved = this.parseIntValue(msmeData[10]);
                    this.SourcePrivate = this.parseIntValue(msmeData[11]);
                    this.SourceGov = this.parseIntValue(msmeData[12]);
                    this.SourceNonBank = this.parseIntValue(msmeData[13]);
                    this.SourceOther = this.parseIntValue(msmeData[14]);
                    this.Gdp2005 = this.getIntValue(this.indData[3]);
                    this.GdpCurrent = this.getIntValue(this.indData[4]);
                    this.Atms = this.parseFloatValue(this.indData[5]);
                    this.BankBranches = this.parseFloatValue(this.indData[6]);
                    this.PosTerminals = this.parseFloatValue(this.indData[7]);
                    this.DomesticCredit = this.parseFloatValue(this.indData[8]);
                    this.LendingIr = this.parseFloatValue(this.indData[9]);
                    this.Population = this.getIntValue(this.indData[10]);
                    this.PopulationAges = this.parseFloatValue(this.indData[11]);
                    this.MobileSubscriptions = this.parseFloatValue(this.indData[12]);
                    this.LaborForce = this.getIntValue(this.indData[13]);
                    this.EmploymentRatio = this.parseFloatValue(this.indData[14]);
                    this.PovertyRatio = this.parseFloatValue(this.indData[15]);
                    this.LegalRightsStrength = this.parseFloatValue(this.indData[16]);
                    this.CreditDepth = this.parseFloatValue(this.indData[17]);
                    this.EaseOfBusiness = this.parseFloatValue(this.indData[18]);
                    this.LiteracyRate = this.parseFloatValue(this.indData[19]);
                    this.DepositIr = this.parseFloatValue(this.indData[20]);
                    this.Unemployment = this.parseFloatValue(this.indData[21]);
                    this.IrSpread = this.parseFloatValue(this.indData[22]);
                    this.PrivateCreditCoverage = this.parseFloatValue(this.indData[23]);
                    this.PublicCreditCoverage = this.parseFloatValue(this.indData[24]);
                    this.LaborMale = this.parseFloatValue(this.indData[25]);
                    this.LaborFemale = this.parseFloatValue(this.indData[26]);
                    this.UrbanPopulation = this.parseFloatValue(this.indData[27]);
                    break;
            }
        }
        SummaryItem.prototype.parseIntValue = function (obj) {
            return (obj != null) ? parseInt(obj) : null;
        };

        SummaryItem.prototype.numberWithCommas = function (x) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        };

        SummaryItem.prototype.parseFloatValue = function (obj) {
            var result = null;
            if (obj != "" && obj != null) {
                result = parseFloat(obj);
                if (result == parseInt(obj)) {
                    return this.numberWithCommas(obj);
                } else {
                    return this.numberWithCommas(result.toFixed(2));
                }
            } else {
                return "";
            }
        };

        SummaryItem.prototype.getIntValue = function (obj) {
            var result = null;
            if (obj != "" && obj != null) {
                result = parseInt(obj);
                return this.numberWithCommas(result);
            } else {
                return "";
            }
        };

        SummaryItem.prototype.updateCharts = function (series1, series2, series3) {
            series1.update({
                name: this.Name,
                data: [this.Checking, this.Overdratf, this.Loan, this.Credit]
            }, false);

            series2.update({
                name: this.Name,
                data: [this.DoesNotNeedCredit, this.Unserved, this.Underserved, this.Wellserved]
            }, false);

            series3.update({
                name: this.Name,
                data: [this.SourcePrivate, this.SourceGov, this.SourceNonBank, this.SourceOther]
            }, false);
        };
        return SummaryItem;
    })();
    models.SummaryItem = SummaryItem;
})(models || (models = {}));
