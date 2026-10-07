import assert from 'node:assert/strict'
import { test } from 'node:test'
import { notificationSelection, belongsToFarmer, refreshNotifications, notificationPollInterval } from '../src/lib/notifications.js'
test('notification filters validate URL pages and survive reload', () => {
  assert.deepEqual(notificationSelection(new URLSearchParams('status=unread&page=2')),{page:2,unreadOnly:true})
  for(const page of ['0','-1','NaN','2.5','1000001']) assert.equal(notificationSelection(new URLSearchParams(`page=${page}`)).page,1)
})
test('realtime events reject another account and identity-free payloads', () => {
  assert.equal(belongsToFarmer({farmerId:'a'},'a'),true)
  assert.equal(belongsToFarmer({farmerId:'a'},'b'),false)
  assert.equal(belongsToFarmer({},'a'),false)
})
test('notification mutations refresh only the current account list, badge and dashboard',async()=>{
  const keys=[]
  await refreshNotifications({invalidateQueries:async({queryKey}, options)=>{assert.equal(options.cancelRefetch,false);keys.push(queryKey)}},'a')
  assert.deepEqual(keys,[['notifications','a'],['notifications-count','a'],['dashboard','a']])
})
test('notification polling pauses during requests and after errors, then resumes after success',()=>{
  assert.equal(notificationPollInterval({state:{status:'success',fetchStatus:'idle'}}),60000)
  for(const state of [{status:'success',fetchStatus:'fetching'},{status:'success',fetchStatus:'paused'},{status:'pending',fetchStatus:'fetching'},{status:'error',fetchStatus:'idle'}]) assert.equal(notificationPollInterval({state}),false)
})
