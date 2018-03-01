import appConfig from '@apiConfig';
import { mapGetters } from 'vuex';
export default
    {
        computed: {
            ...mapGetters({
                searchEmployees: 'getSearchEmployees'
            }),
            totalPages() {
                return Math.ceil(this.paginationEmployees.resultCount / this.paginationEmployees.itemsPerPage)
            },
            paginateEmployees() {
                this.paginationEmployees.resultCount = this.filterEmplooyees(this.employees).length;
                if (this.paginationEmployees.resultCount == 0) {
                    this.paginationEmployees.currentItemsPerPage = 0;
                    this.paginationEmployees.currentMaxItemsPerPage = 0;
                    return false;
                }
                (this.totalPages < this.paginationEmployees.currentPage) && (this.paginationEmployees.currentPage = 1);
                this.paginationEmployees.currentItemsPerPage = this.paginationEmployees.currentPage * this.paginationEmployees.itemsPerPage - (this.paginationEmployees.itemsPerPage - 1);
                this.paginationEmployees.currentMaxItemsPerPage = this.paginationEmployees.currentPage * this.paginationEmployees.itemsPerPage + 1 <= this.paginationEmployees.resultCount ? this.paginationEmployees.currentPage * this.paginationEmployees.itemsPerPage :
                    this.paginationEmployees.resultCount;
                var index = this.paginationEmployees.currentPage * this.paginationEmployees.itemsPerPage - this.paginationEmployees.itemsPerPage;
                return this.filterEmplooyees(this.employees).slice(index, index + this.paginationEmployees.itemsPerPage)
            }
        },
        methods: {
            srcPhoto(photoUrl) {
                return photoUrl ? `${appConfig.api}/img/${photoUrl}` : require('@/assets/no-photo.png');
            },
            addEmployee() {
                return this.$router.push('add');
            },
            editEmployee(id) {
                return this.$router.push({
                    name: 'EmployeeEdit',
                    params: { userId: id }
                });
            },
            filterEmplooyees(employees) {
                return employees.filter(x => {
                    const searchStr = x.email + ' ' + x.firstName + ' ' + x.lastName + ' ' +
                        x.position + ' ' + x.skype + ' ' + x.telegram + ' ' + x.phoneNumber;
                    return searchStr.match(new RegExp(this.searchEmployees, 'i'));
                });
            },
            nextPage() {
                this.paginationEmployees.currentPage < this.totalPages && this.paginationEmployees.currentPage++;
            },
            prevPage() {
                this.paginationEmployees.currentPage - 1 > 0 && this.paginationEmployees.currentPage--;
            }
        }

    };