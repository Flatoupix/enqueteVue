<template>
<ul>
    <li v-for="(lang,id) in languages" :key="id" @click="select(lang.codeLang)">
        {{ lang.codeLang }}
</li>
</ul>
</template>
<script>
export default {
    props:{
        languages:{
            type:Array
        }
    },
    methods: {
        select(selLang) {
          
            this.$sessionVars.selectedLang = this.languages.filter(lang => lang.codeLang == selLang)[0]
        }
    },
}
</script>

<style>

</style>