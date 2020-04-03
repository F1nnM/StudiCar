<template>
  <div class="q-pa-md">
    <div class="q-gutter-y-md" style="max-width: 600px">
            <div class="text-h4">{{ greeting }}, {{ user.name }}</div>
            <hr>
            <br>
            

    </div>
  </div>
</template>

<script>

export default {

data(){
    var hours = (new Date()).getHours();
    var greeting = 'Willkommen';
    if(hours > 18){
        greeting = 'Guten Abend';
    }
    else if(hours < 8){
        greeting = 'Guten Morgen';
    }
    return {
        'greeting': greeting,
        user: {
            name: 'Bernd'
        }
    }
}
    
    
}
</script>