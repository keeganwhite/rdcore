<?php
/**
 * Created by G-edit.
 * User: dirkvanderwalt
 * Date: 17/April/2023
 * Time: 00:00
 */

namespace App\Controller;
use Cake\Core\Configure;
use Cake\Core\Configure\Engine\PhpConfig;
use Cake\I18n\FrozenTime;

class FirewallProfilesController extends AppController {

    public $base            = "Access Providers/Controllers/FirewallProfiles/";
    protected $owner_tree   = [];
    protected $main_model   = 'FirewallProfiles';
    
    public function initialize():void{
        parent::initialize();
        
        $this->loadModel($this->main_model);
        $this->loadModel('Users');
        $this->loadModel('FirewallProfileEntries');

        $this->loadComponent('CommonQueryFlat', [ //Very important to specify the Model
            'model'     => 'FirewallProfiles',
            'sort_by'   => 'FirewallProfiles.name'
        ]);
        
        $this->loadComponent('Aa');
        $this->loadComponent('GridButtonsFlat');    
        $this->loadComponent('JsonErrors'); 
        $this->loadComponent('TimeCalculations');
        $this->loadComponent('Schedule');
    }
    
    public function indexCombo(){
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }
      
        $req_q    = $this->request->getQuery();      
       	$cloud_id = $req_q['cloud_id'];
        $query 	  = $this->{$this->main_model}->find();      
        $this->CommonQueryFlat->build_cloud_query($query,$cloud_id,[]);


        //===== PAGING (MUST BE LAST) ======
        $limit = 50;   //Defaults
        $page = 1;
        $offset = 0;
        if (isset($req_q['limit'])) {
            $limit  = $req_q['limit'];
            $page   = $req_q['page'];
            $offset = $req_q['start'];
        }

        $query->page($page);
        $query->limit($limit);
        $query->offset($offset);

        $total  = $query->count();
        $q_r    = $query->all();
        $items  = [];
        
        if($req_q['include_all_option'] == true){
        	array_push($items, ['id' => 0,'name' => '**All Schedules**']);      
        }

        foreach ($q_r as $i) {
	        array_push($items, ['id' => $i->id,'name' => $i->name]);        
        }

        //___ FINAL PART ___
        $this->set([
            'items'         => $items,
            'success'       => true,
            'totalCount'    => $total
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }
    
     public function indexDataView(){
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }

        $req_q    = $this->request->getQuery();      
       	$cloud_id = $req_q['cloud_id'];
        $query 	  = $this->{$this->main_model}->find();      
        $this->CommonQueryFlat->build_cloud_query($query,$cloud_id,['FirewallProfileEntries']);
        
        if(isset($req_q['id'])){
        	if($req_q['id'] > 0){
        		$query->where(['FirewallProfile.id' => $req_q['id']]);
        	}	   
        }


        //===== PAGING (MUST BE LAST) ======
        $limit = 50;   //Defaults
        $page = 1;
        $offset = 0;
        if (isset($req_qy['limit'])) {
            $limit  = $req_q['limit'];
            $page   = $req_q['page'];
            $offset = $req_q['start'];
        }

        $query->page($page);
        $query->limit($limit);
        $query->offset($offset);

        $total  = $query->count();
        $q_r    = $query->all();
        $items  = [];

        foreach ($q_r as $i) {
       
            $row            = [];       
			$row['id']      = $i->id.'_0'; //Signifies Firewall Profile
			$row['name']	= $i->name;
			$row['type']	= 'firewall_profile';
			$row['firewall_profile_id'] = $i->id;		
			array_push($items, $row);
			
			foreach($i->firewall_profile_entries as $se){
				$se->command_type = $se->type;			
				$se->type = 'firewall_profile_entry';
				$se->time_human = $this->timeFormat($se->event_time);
				if($se->predefined_command){
					$se->command = $se->predefined_command->command;
				}
				$se->everyday = false;
				if($se->mo && $se->tu && $se->we && $se->th && $se->fr && $se->sa && $se->su){
					$se->everyday = true;	
				}
				
				array_push($items, $se);		
			}
					
			array_push($items,[ 'id' => '0_'.$i->id, 'type'	=> 'add','name' => 'Firewall Profile Entry', 'firewall_profile_id' =>  $i->id, 'firewall_profile_name' => $i->name ]);
			
        }
        

        //___ FINAL PART ___
        $this->set([
            'items'         => $items,
            'success'       => true,
            'totalCount'    => $total
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }
    
    
    
    public function index(){
        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if (!$user) {
            return;
        }

        $req_q    = $this->request->getQuery();      
       	$cloud_id = $req_q['cloud_id'];
        $query 	  = $this->{$this->main_model}->find();      
        $this->CommonQueryFlat->build_cloud_query($query,$cloud_id,['ScheduleEntries']);


        //===== PAGING (MUST BE LAST) ======
        $limit = 50;   //Defaults
        $page = 1;
        $offset = 0;
        if (isset($req_qy['limit'])) {
            $limit  = $req_q['limit'];
            $page   = $req_q['page'];
            $offset = $req_q['start'];
        }

        $query->page($page);
        $query->limit($limit);
        $query->offset($offset);

        $total  = $query->count();
        $q_r    = $query->all();
        $items  = [];

        foreach ($q_r as $i) {
       
            $row            = [];
            $fields         = $this->{$this->main_model}->getSchema()->columns();
            foreach($fields as $field){
                $row["$field"]= $i->{"$field"};
                
                if($field == 'created'){
                    $row['created_in_words'] = $this->TimeCalculations->time_elapsed_string($i->{"$field"});
                }
                if($field == 'modified'){
                    $row['modified_in_words'] = $this->TimeCalculations->time_elapsed_string($i->{"$field"});
                }   
            } 
                
			$row['update']  = true;
			$row['delete']  = true; 
			$row['id']      = $row['id'].'_0'; //Signifies empty
			$row['description'] = '';			
			$columns = ['description','type', 'gpio_number', 'gpio_state','command', 'mo', 'tu','we','th','fr','sa','su','event_time'];					
			if(count($i->schedule_entries) > 0){
			    foreach($i->schedule_entries as $se){
			        $row['id']   = $i->id.'_'.$se->id;
			        foreach($columns as $c){
                        $row[$c] = $se->{$c};
                    }
			        array_push($items, $row);   
			    }
	        }else{
	            array_push($items, $row);
	        }          
        }

        //___ FINAL PART ___
        $this->set([
            'items'         => $items,
            'success'       => true,
            'totalCount'    => $total
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }
    
    public function add(){
     
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
           
        if ($this->request->is('post')) {          
            $entity = $this->{$this->main_model}->newEntity($this->request->getData()); 
            if ($this->{$this->main_model}->save($entity)) {
                $this->set([
                    'success' => true
                ]);
                $this->viewBuilder()->setOption('serialize', true);
            } else {
                $message = __('Could not update item');
                $this->JsonErrors->entityErros($entity,$message);
            }    
        }
    }
    
    public function delete() {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $fail_flag 	= false;
        $req_d 		= $this->request->getData();

	    if(isset($req_d['id'])){   //Single item delete
            $entity     = $this->{$this->main_model}->get($req_d['id']);   
            $this->{$this->main_model}->delete($entity);

        }else{                          //Assume multiple item delete
            foreach($req_d as $d){
                $entity     = $this->{$this->main_model}->get($d['id']);  
                $this->{$this->main_model}->delete($entity);
            }
        }

        if($fail_flag == true){
            $this->set([
                'success'   => false,
                'message'   => __('Could not delete some items'),
            ]);
            $this->viewBuilder()->setOption('serialize', true);
        }else{
            $this->set([
                'success' => true
            ]);
            $this->viewBuilder()->setOption('serialize', true);
        }
	}
	
    public function edit(){
	   
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        if ($this->request->is('post')) { 
            $req_d  = $this->request->getData();        
            $check_items = [
			    'available_to_siblings'
		    ];
            foreach($check_items as $i){
                if(isset($req_d[$i])){
                    $req_d[$i] = 1;
                }else{
                    $req_d[$i] = 0;
                }
            }
            $ids            = explode("_", $this->request->getData('id'));  
            $req_d['id']    = $ids[0];
            $entity         = $this->{$this->main_model}->find()->where(['id' => $req_d['id']])->first();
            
            if($entity){
                $this->{$this->main_model}->patchEntity($entity, $req_d); 
                if ($this->{$this->main_model}->save($entity)) {
                    $this->set(array(
                        'success' => true
                    ));
                    $this->viewBuilder()->setOption('serialize', true);
                } else {
                    $message = __('Could not update item');
                    $this->JsonErrors->entityErros($entity,$message);
                }   
            }
        }
    }
    
    public function addScheduleEntry(){
     
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
          
        if ($this->request->is('post')) {       
            $req_data = $this->request->getData();
        
            $check_items = [
			    'mo', 'tu', 'we', 'th','fr','sa','su'
		    ];
            foreach($check_items as $i){
                if(isset($req_data[$i])){
                    $req_data[$i] = 1;
                }else{
                    $req_data[$i] = 0;
                }
            }
            
            $entity = $this->{'ScheduleEntries'}->newEntity($req_data); 
            if ($this->{'ScheduleEntries'}->save($entity)) {
                $this->set([
                    'success' => true
                ]);
                $this->viewBuilder()->setOption('serialize', true);
            } else {
                $message = __('Could not update item');
                $this->JsonErrors->entityErros($entity,$message);
            }    
        }
    }
    
    public function viewScheduleEntry(){
     
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
        
        $req_q      = $this->request->getQuery();
        $id         = $req_q['schedule_entry_id'];  
        $data       = [];
        $entity     = $this->{'ScheduleEntries'}->find()->where(['ScheduleEntries.id' => $id])->contain(['PredefinedCommands'])->first();
        if($entity){
            $data       =  $entity->toArray();
            if($entity->predefined_command !== null){
                $data['predefined_command_name'] = $entity->predefined_command->name;
            }
        }
        $this->set([
            'data'      => $data,
            'success'   => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }
    
    public function editScheduleEntry(){
     
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }
           
        if ($this->request->is('post')) {
        
            $req_data = $this->request->getData();   
            $check_items = [
			    'mo', 'tu', 'we', 'th','fr','sa','su'
		    ];
            foreach($check_items as $i){
                if(isset($req_data[$i])){
                    $req_data[$i] = 1;
                }else{
                    $req_data[$i] = 0;
                }
            }
            $id = $req_data['schedule_entry_id'];
            
            $entity = $this->{'ScheduleEntries'}->find()->where(['ScheduleEntries.id' => $id])->first();
            if($entity){
                $this->{'ScheduleEntries'}->patchEntity($entity, $req_data);  
                if ($this->{'ScheduleEntries'}->save($entity)) {
                    $this->set([
                        'success' => true
                    ]);
                    $this->viewBuilder()->setOption('serialize', true);
                } else {
                    $message = __('Could not update item');
                    $this->JsonErrors->entityErros($entity,$message);
                }
            }    
        }
    }
    
    public function deleteScheduleEntry() {
		if (!$this->request->is('post')) {
			throw new MethodNotAllowedException();
		}

        //__ Authentication + Authorization __
        $user = $this->_ap_right_check();
        if(!$user){
            return;
        }

        $fail_flag 	= false;
        $req_d 		= $this->request->getData();

	    if(isset($req_d['id'])){   //Single item delete
            $message = "Single item ".$req_d['id'];       
            $entity     = $this->{'ScheduleEntries'}->get($req_d['id']);   
            $this->{'ScheduleEntries'}->delete($entity);
             
        }else{                          //Assume multiple item delete
            foreach($req_d as $d){
                $entity     = $this->{'ScheduleEntries'}->get($d['id']);     
                $this->{'ScheduleEntries'}->delete($entity);                
            }
        }

        if($fail_flag == true){
            $this->set([
                'success'   => false,
                'message'   => __('Could not delete some items'),
            ]);
            $this->viewBuilder()->setOption('serialize', true);
        }else{
            $this->set([
                'success' => true
            ]);
            $this->viewBuilder()->setOption('serialize', true);
        }
	}
	
    public function menuForGrid(){
        $user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
        
        $menu = $this->GridButtonsFlat->returnButtons(false,'Schedules');
        $this->set([
            'items'         => $menu,
            'success'       => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);
    }
    
    public function defaultSchedule(){
    
    	$user = $this->Aa->user_for_token($this);
        if(!$user){   //If not a valid user
            return;
        }
           
        $this->set([
            'items'			=> $this->Schedule->getSchedule(30),
            'success'       => true
        ]);
        $this->viewBuilder()->setOption('serialize', true);  
    }
    
    private function timeFormat($event_time){
    
    	$m       = $event_time % 60;
        $h       = ($event_time-$m)/60;
        $hrs_mins= $h.":".str_pad($m, 2, "0", STR_PAD_LEFT);
        return $hrs_mins;
    
    }
    
}